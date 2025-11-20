#!/usr/bin/env node

/**
 * Linear to Notion Sync Script
 * Syncs Linear issues to Notion Tasks database
 * 
 * Usage: node automation/linear-to-notion.js
 */

const {
  NotionClient,
  LinearClient,
  Logger,
  NOTION_DATABASES,
  mapLinearStateToNotionStatus,
  mapLinearPriorityToNotion,
  extractLinearIssueId,
} = require('./utils');

const path = require('path');

async function syncLinearToNotion() {
  const logFile = path.join(__dirname, '../logs', `linear-to-notion-${new Date().toISOString().split('T')[0]}.log`);
  const logger = new Logger(logFile);

  try {
    logger.info('Starting Linear → Notion sync');

    const notion = new NotionClient();
    const linear = new LinearClient();

    // Fetch all Linear issues
    const linearIssues = await linear.getIssues();
    logger.info(`Found ${linearIssues.length} Linear issues`);

    // Fetch existing Notion tasks to check for duplicates
    const notionTasks = await notion.queryDatabase(NOTION_DATABASES.TASKS);
    const notionTaskMap = new Map();
    notionTasks.forEach(task => {
      const linearIssueId = extractLinearIssueId(task.properties['Linear Issue']);
      if (linearIssueId) {
        notionTaskMap.set(linearIssueId, task);
      }
    });

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (const issue of linearIssues) {
      try {
        const existingTask = notionTaskMap.get(issue.identifier);

        if (existingTask) {
          // Update existing Notion task
          const needsUpdate = shouldUpdateTask(existingTask, issue);
          if (needsUpdate) {
            await updateNotionTask(notion, existingTask.id, issue);
            updated++;
            logger.info(`Updated Notion task for Linear issue: ${issue.identifier}`);
          } else {
            skipped++;
          }
        } else {
          // Create new Notion task
          await createNotionTask(notion, issue);
          created++;
          logger.success(`Created Notion task for Linear issue: ${issue.identifier}`, {
            linearIssueId: issue.id,
            identifier: issue.identifier,
          });
        }
      } catch (error) {
        errors.push({ issueId: issue.id, error: error.message });
        logger.error(`Failed to sync Linear issue ${issue.identifier}: ${error.message}`, { error });
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
    logger.error('Fatal error in Linear → Notion sync', { error: error.message });
    await logger.save();
    throw error;
  }
}

function shouldUpdateTask(notionTask, linearIssue) {
  const props = notionTask.properties;
  
  // Check status
  const notionStatus = props.Status?.select?.name || 'To Do';
  const linearStatus = mapLinearStateToNotionStatus(linearIssue.state?.name);
  if (notionStatus !== linearStatus) return true;

  // Check priority
  const notionPriority = props.Priority?.select?.name || 'Medium';
  const linearPriority = mapLinearPriorityToNotion(linearIssue.priority);
  if (notionPriority !== linearPriority) return true;

  // Check due date
  const notionDueDate = props['Due Date']?.date?.start || null;
  const linearDueDate = linearIssue.dueDate ? linearIssue.dueDate.split('T')[0] : null;
  if (notionDueDate !== linearDueDate) return true;

  return false;
}

async function updateNotionTask(notion, taskId, issue) {
  const status = mapLinearStateToNotionStatus(issue.state?.name);
  const priority = mapLinearPriorityToNotion(issue.priority);
  const dueDate = issue.dueDate ? issue.dueDate.split('T')[0] : null;

  const properties = {
    'Linear Issue': {
      rich_text: [{
        text: { content: `${issue.identifier} - ${issue.url}` },
      }],
    },
    Status: {
      select: { name: status },
    },
    Priority: {
      select: { name: priority },
    },
  };

  if (dueDate) {
    properties['Due Date'] = {
      date: { start: dueDate },
    };
  }

  // Update description if changed
  if (issue.description) {
    const description = issue.description + `\n\n[Linear Issue: ${issue.url}]`;
    properties.Details = {
      rich_text: [{
        text: { content: description },
      }],
    };
  }

  return notion.updatePage(taskId, properties);
}

async function createNotionTask(notion, issue) {
  const status = mapLinearStateToNotionStatus(issue.state?.name);
  const priority = mapLinearPriorityToNotion(issue.priority);
  const dueDate = issue.dueDate ? issue.dueDate.split('T')[0] : null;

  const properties = {
    Name: {
      title: [{
        text: { content: issue.title },
      }],
    },
    Status: {
      select: { name: status },
    },
    Priority: {
      select: { name: priority },
    },
    'Linear Issue': {
      rich_text: [{
        text: { content: `${issue.identifier} - ${issue.url}` },
      }],
    },
  };

  if (issue.description) {
    const description = issue.description + `\n\n[Linear Issue: ${issue.url}]`;
    properties.Details = {
      rich_text: [{
        text: { content: description },
      }],
    };
  }

  if (dueDate) {
    properties['Due Date'] = {
      date: { start: dueDate },
    };
  }

  return notion.createPage(NOTION_DATABASES.TASKS, properties);
}

// Run if executed directly
if (require.main === module) {
  syncLinearToNotion()
    .then(result => {
      console.log('\n✅ Linear → Notion sync complete!');
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

module.exports = { syncLinearToNotion };

