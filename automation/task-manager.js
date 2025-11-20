#!/usr/bin/env node

/**
 * Task Manager Script
 * Assigns unassigned tasks to available agents based on workload balance
 * 
 * Usage: node automation/task-manager.js
 */

const {
  NotionClient,
  LinearClient,
  Logger,
  NOTION_DATABASES,
  AGENTS,
  MAX_TASKS_PER_AGENT,
} = require('./utils');

const path = require('path');

async function assignTasks() {
  const logFile = path.join(__dirname, '../logs', `task-manager-${new Date().toISOString().split('T')[0]}.log`);
  const logger = new Logger(logFile);

  try {
    logger.info('Starting task assignment');

    const notion = new NotionClient();
    const linear = new LinearClient();

    // Fetch all tasks from Notion
    const notionTasks = await notion.queryDatabase(NOTION_DATABASES.TASKS);
    logger.info(`Found ${notionTasks.length} Notion tasks`);

    // Fetch all Linear issues
    const linearIssues = await linear.getIssues();
    logger.info(`Found ${linearIssues.length} Linear issues`);

    // Calculate current workload per agent
    const workload = calculateWorkload(notionTasks, linearIssues);
    logger.info('Current workload:', workload);

    // Find unassigned tasks
    const unassignedTasks = notionTasks.filter(task => {
      const assignee = task.properties.Assignee?.people || [];
      return assignee.length === 0 && 
             task.properties.Status?.select?.name !== 'Done' &&
             task.properties.Status?.select?.name !== 'Canceled';
    });

    logger.info(`Found ${unassignedTasks.length} unassigned tasks`);

    let assigned = 0;
    const errors = [];

    for (const task of unassignedTasks) {
      try {
        // Find agent with least workload
        const agent = selectAgent(workload);
        if (!agent) {
          logger.warn('All agents at capacity, skipping assignment');
          break;
        }

        // Assign task to agent
        await assignTaskToAgent(notion, linear, task, agent);
        workload[agent]++;
        assigned++;

        logger.success(`Assigned task "${getTaskName(task)}" to ${agent}`, {
          taskId: task.id,
          agent,
          newWorkload: workload[agent],
        });
      } catch (error) {
        errors.push({ taskId: task.id, error: error.message });
        logger.error(`Failed to assign task ${task.id}: ${error.message}`, { error });
      }
    }

    logger.info('Task assignment complete', {
      assigned,
      errors: errors.length,
      finalWorkload: workload,
    });

    await logger.save();
    return { assigned, errors, workload };
  } catch (error) {
    logger.error('Fatal error in task assignment', { error: error.message });
    await logger.save();
    throw error;
  }
}

function calculateWorkload(notionTasks, linearIssues) {
  const workload = {};
  AGENTS.forEach(agent => {
    workload[agent] = 0;
  });

  // Count Notion tasks per agent
  notionTasks.forEach(task => {
    const assignees = task.properties.Assignee?.people || [];
    const status = task.properties.Status?.select?.name;
    
    if (status !== 'Done' && status !== 'Canceled') {
      assignees.forEach(person => {
        const name = person.name || '';
        const agent = AGENTS.find(a => name.includes(a));
        if (agent) {
          workload[agent]++;
        }
      });
    }
  });

  // Count Linear issues per agent
  linearIssues.forEach(issue => {
    if (issue.state?.type !== 'completed' && issue.assignee) {
      const assigneeName = issue.assignee.name || '';
      const agent = AGENTS.find(a => assigneeName.includes(a));
      if (agent) {
        workload[agent]++;
      }
    }
  });

  return workload;
}

function selectAgent(workload) {
  // Find agent with least workload who is under capacity
  const availableAgents = AGENTS.filter(agent => workload[agent] < MAX_TASKS_PER_AGENT);
  
  if (availableAgents.length === 0) {
    return null;
  }

  // Return agent with least workload
  return availableAgents.reduce((min, agent) => 
    workload[agent] < workload[min] ? agent : min
  );
}

async function assignTaskToAgent(notion, linear, task, agent) {
  // Get team member ID for agent (simplified - would need to query Team DB)
  // For now, we'll use the agent name as assignee
  
  // Update Notion task
  await notion.updatePage(task.id, {
    Assignee: {
      people: [{
        name: agent,
      }],
    },
  });

  // Update Linear issue if exists
  const linearIssueId = task.properties['Linear Issue']?.rich_text?.[0]?.plain_text;
  if (linearIssueId) {
    try {
      const issues = await linear.getIssues();
      const issue = issues.find(i => 
        i.identifier === linearIssueId || 
        linearIssueId.includes(i.identifier)
      );
      
      if (issue) {
        // Note: Linear API requires user ID, not name
        // This is a simplified version - would need to map agent names to Linear user IDs
        // For now, we'll log that assignment should be done manually
        logger.info(`Linear issue ${issue.identifier} should be assigned to ${agent} (manual step)`);
      }
    } catch (error) {
      logger.warn(`Failed to assign Linear issue: ${error.message}`);
    }
  }
}

function getTaskName(task) {
  return task.properties.Name?.title?.[0]?.plain_text || 'Untitled Task';
}

// Run if executed directly
if (require.main === module) {
  assignTasks()
    .then(result => {
      console.log('\n✅ Task assignment complete!');
      console.log(`   Assigned: ${result.assigned} tasks`);
      console.log('\n   Final workload:');
      Object.entries(result.workload).forEach(([agent, count]) => {
        console.log(`     ${agent}: ${count}/${MAX_TASKS_PER_AGENT}`);
      });
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.length}`);
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Task assignment failed:', error.message);
      process.exit(1);
    });
}

module.exports = { assignTasks };

