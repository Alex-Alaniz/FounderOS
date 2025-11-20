#!/usr/bin/env node

/**
 * Notion to Linear Sync Script
 * Syncs Notion Tasks database to Linear issues
 * 
 * Usage: node automation/notion-to-linear.js
 */

const {
  NotionClient,
  LinearClient,
  Logger,
  NOTION_DATABASES,
  LINEAR_TEAM_ID,
  mapNotionStatusToLinearState,
  mapNotionPriorityToLinear,
  extractLinearIssueId,
} = require('./utils');

const path = require('path');

async function syncNotionToLinear() {
  const logFile = path.join(__dirname, '../logs', `notion-to-linear-${new Date().toISOString().split('T')[0]}.log`);
  const logger = new Logger(logFile);

  try {
    logger.info('Starting Notion → Linear sync');

    const notion = new NotionClient();
    const linear = new LinearClient();

    // Get Linear teams and states
    const teams = await linear.getTeams();
    if (teams.length === 0) {
      throw new Error('No Linear teams found');
    }
    const team = teams[0]; // Use first team
    logger.info(`Using Linear team: ${team.name} (${team.id})`);

    const states = await linear.getStates(team.id);
    logger.info(`Found ${states.length} workflow states`);

    // Fetch all Notion tasks
    const notionTasks = await notion.queryDatabase(NOTION_DATABASES.TASKS);
    logger.info(`Found ${notionTasks.length} Notion tasks`);

    // Fetch existing Linear issues to check for duplicates
    const linearIssues = await linear.getIssues({ team: { id: { eq: team.id } } });
    const linearIssueMap = new Map();
    linearIssues.forEach(issue => {
      // Try to match by identifier in description or title
      const notionId = extractNotionIdFromIssue(issue);
      if (notionId) {
        linearIssueMap.set(notionId, issue);
      }
    });

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (const task of notionTasks) {
      try {
        const taskProps = task.properties;
        const taskId = task.id;
        const taskName = getPropertyValue(taskProps, 'Name', 'title');
        const taskStatus = getPropertyValue(taskProps, 'Status', 'select');
        const taskPriority = getPropertyValue(taskProps, 'Priority', 'select');
        const taskDetails = getPropertyValue(taskProps, 'Details', 'rich_text');
        const taskDueDate = getPropertyValue(taskProps, 'Due Date', 'date');
        const linearIssueId = extractLinearIssueId(taskProps['Linear Issue']);

        // Skip if task is already synced and up to date
        const existingIssue = linearIssueMap.get(taskId);
        if (existingIssue && linearIssueId === existingIssue.identifier) {
          // Check if update is needed
          const needsUpdate = shouldUpdateIssue(existingIssue, {
            status: taskStatus,
            priority: taskPriority,
            dueDate: taskDueDate,
          });

          if (needsUpdate) {
            await updateLinearIssue(linear, existingIssue.id, {
              status: taskStatus,
              priority: taskPriority,
              dueDate: taskDueDate,
            }, states, logger);
            updated++;
            logger.info(`Updated Linear issue ${existingIssue.identifier} for task: ${taskName}`);
          } else {
            skipped++;
          }
          continue;
        }

        // Create new Linear issue
        if (!taskName) {
          logger.warn(`Skipping task ${taskId}: no name`);
          skipped++;
          continue;
        }

        const linearState = mapNotionStatusToLinearState(taskStatus || 'To Do');
        const linearPriority = mapNotionPriorityToLinear(taskPriority || 'Medium');

        // Find matching state
        const targetState = states.find(s => 
          s.name.toLowerCase() === linearState.toLowerCase() || 
          s.type.toLowerCase() === linearState.toLowerCase()
        ) || states.find(s => s.type === 'backlog');

        const issueInput = {
          teamId: team.id,
          title: taskName,
          description: taskDetails || `Synced from Notion task: ${taskId}`,
          stateId: targetState?.id,
          priority: linearPriority,
          dueDate: taskDueDate || null,
        };

        const newIssue = await linear.createIssue(issueInput);
        created++;

        // Update Notion task with Linear issue link
        await notion.updatePage(taskId, {
          'Linear Issue': {
            rich_text: [{
              text: { content: `${newIssue.identifier} - ${newIssue.url}` },
            }],
          },
        });

        logger.success(`Created Linear issue ${newIssue.identifier} for task: ${taskName}`, {
          linearIssueId: newIssue.id,
          notionTaskId: taskId,
        });

      } catch (error) {
        errors.push({ taskId: task.id, error: error.message });
        logger.error(`Failed to sync task ${task.id}: ${error.message}`, { error });
      }
    }

    logger.info('Sync complete', {
      created,
      updated,
      skipped,
      errors: errors.length,
    });

    await logger.save();
    return { created, updated, skipped, errors };
  } catch (error) {
    logger.error('Fatal error in Notion → Linear sync', { error: error.message });
    await logger.save();
    throw error;
  }
}

function getPropertyValue(properties, name, type) {
  const prop = properties[name];
  if (!prop) return null;

  switch (type) {
    case 'title':
      return prop.title?.[0]?.plain_text || null;
    case 'rich_text':
      return prop.rich_text?.map(t => t.plain_text).join('\n') || null;
    case 'select':
      return prop.select?.name || null;
    case 'date':
      return prop.date?.start || null;
    case 'url':
      return prop.url || null;
    default:
      return null;
  }
}

function extractNotionIdFromIssue(issue) {
  // Try to extract Notion page ID from issue description
  if (issue.description) {
    const match = issue.description.match(/Notion task: ([a-f0-9-]+)/i);
    if (match) return match[1];
  }
  return null;
}

function shouldUpdateIssue(issue, taskData) {
  // Compare issue state with task status
  const currentState = issue.state?.name?.toLowerCase();
  const targetState = mapNotionStatusToLinearState(taskData.status || 'To Do').toLowerCase();
  
  if (currentState !== targetState) return true;

  // Compare priorities
  const currentPriority = issue.priority;
  const targetPriority = mapNotionPriorityToLinear(taskData.priority || 'Medium');
  if (currentPriority !== targetPriority) return true;

  // Compare due dates
  if (issue.dueDate !== taskData.dueDate) return true;

  return false;
}

async function updateLinearIssue(linear, issueId, taskData, states, logger) {
  const linearState = mapNotionStatusToLinearState(taskData.status || 'To Do');
  const linearPriority = mapNotionPriorityToLinear(taskData.priority || 'Medium');

  const targetState = states.find(s => 
    s.name.toLowerCase() === linearState.toLowerCase() || 
    s.type.toLowerCase() === linearState.toLowerCase()
  );

  const updateInput = {};
  if (targetState) updateInput.stateId = targetState.id;
  if (linearPriority !== null) updateInput.priority = linearPriority;
  if (taskData.dueDate) updateInput.dueDate = taskData.dueDate;

  return linear.updateIssue(issueId, updateInput);
}

// Run if executed directly
if (require.main === module) {
  syncNotionToLinear()
    .then(result => {
      console.log('\n✅ Notion → Linear sync complete!');
      console.log(`   Created: ${result.created}`);
      console.log(`   Updated: ${result.updated}`);
      console.log(`   Skipped: ${result.skipped}`);
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.length}`);
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Sync failed:', error.message);
      process.exit(1);
    });
}

module.exports = { syncNotionToLinear };

