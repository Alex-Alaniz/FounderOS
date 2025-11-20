#!/usr/bin/env node

/**
 * GitHub PR Sync Script
 * Syncs GitHub PRs to Notion Tasks and Linear issues
 * 
 * Usage: node automation/pr-sync.js
 */

const {
  NotionClient,
  LinearClient,
  GitHubClient,
  Logger,
  NOTION_DATABASES,
  extractLinearIssueId,
  extractGitHubPRUrl,
} = require('./utils');

const path = require('path');

async function syncPRs() {
  const logFile = path.join(__dirname, '../logs', `pr-sync-${new Date().toISOString().split('T')[0]}.log`);
  const logger = new Logger(logFile);

  try {
    logger.info('Starting GitHub PR sync');

    const notion = new NotionClient();
    const linear = new LinearClient();
    const github = new GitHubClient();

    // Fetch all open and recently merged PRs
    const openPRs = await github.getPullRequests('open');
    const closedPRs = await github.getPullRequests('closed');
    const recentClosedPRs = closedPRs.filter(pr => {
      const closedAt = new Date(pr.closed_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return closedAt > weekAgo;
    });

    const allPRs = [...openPRs, ...recentClosedPRs];
    logger.info(`Found ${allPRs.length} PRs (${openPRs.length} open, ${recentClosedPRs.length} recently closed)`);

    // Fetch existing Notion tasks
    const notionTasks = await notion.queryDatabase(NOTION_DATABASES.TASKS);
    const taskPRMap = new Map();
    notionTasks.forEach(task => {
      const prUrl = extractGitHubPRUrl(task.properties['GitHub PR']);
      if (prUrl) {
        const prNumber = extractPRNumber(prUrl);
        if (prNumber) {
          taskPRMap.set(prNumber, task);
        }
      }
    });

    let created = 0;
    let updated = 0;
    let completed = 0;
    const errors = [];

    for (const pr of allPRs) {
      try {
        const prNumber = pr.number;
        const existingTask = taskPRMap.get(prNumber);

        if (existingTask) {
          // Update existing task
          await updateTaskFromPR(notion, linear, existingTask, pr);
          updated++;

          // If PR is merged, mark task as Done
          if (pr.merged_at) {
            await markTaskComplete(notion, linear, existingTask);
            completed++;
            logger.success(`Marked task complete for merged PR #${prNumber}`);
          } else {
            logger.info(`Updated task for PR #${prNumber}`);
          }
        } else {
          // Create new task for PR
          await createTaskFromPR(notion, linear, pr);
          created++;
          logger.success(`Created task for PR #${prNumber}: ${pr.title}`);
        }
      } catch (error) {
        errors.push({ prNumber: pr.number, error: error.message });
        logger.error(`Failed to sync PR #${pr.number}: ${error.message}`, { error });
      }
    }

    logger.info('PR sync complete', {
      created,
      updated,
      completed,
      errors: errors.length,
    });

    await logger.save();
    return { created, updated, completed, errors };
  } catch (error) {
    logger.error('Fatal error in PR sync', { error: error.message });
    await logger.save();
    throw error;
  }
}

function extractPRNumber(prUrl) {
  const match = prUrl.match(/\/pull\/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

async function createTaskFromPR(notion, linear, pr) {
  const prUrl = pr.html_url;
  const prTitle = pr.title;
  const prBody = pr.body || '';
  const prStatus = pr.state;
  const isMerged = !!pr.merged_at;

  // Create Notion task
  const properties = {
    Name: {
      title: [{
        text: { content: `PR #${pr.number}: ${prTitle}` },
      }],
    },
    Status: {
      select: { name: isMerged ? 'Done' : 'In Review' },
    },
    Priority: {
      select: { name: 'Medium' },
    },
    'GitHub PR': {
      url: prUrl,
    },
    Details: {
      rich_text: [{
        text: { content: `GitHub PR: ${prUrl}\n\n${prBody}` },
      }],
    },
  };

  const task = await notion.createPage(NOTION_DATABASES.TASKS, properties);

  // Try to create Linear issue if PR is not merged
  if (!isMerged) {
    try {
      const teams = await linear.getTeams();
      if (teams.length > 0) {
        const team = teams[0];
        const states = await linear.getStates(team.id);
        const inReviewState = states.find(s => s.type === 'in_progress' || s.name.toLowerCase().includes('review'));

        await linear.createIssue({
          teamId: team.id,
          title: `PR #${pr.number}: ${prTitle}`,
          description: `GitHub PR: ${prUrl}\n\n${prBody}`,
          stateId: inReviewState?.id,
        });
      }
    } catch (error) {
      // Linear creation is optional, log but don't fail
      console.warn(`Failed to create Linear issue for PR #${pr.number}:`, error.message);
    }
  }

  return task;
}

async function updateTaskFromPR(notion, linear, task, pr) {
  const prUrl = pr.html_url;
  const isMerged = !!pr.merged_at;
  const status = isMerged ? 'Done' : (pr.state === 'open' ? 'In Review' : 'Done');

  const properties = {
    Status: {
      select: { name: status },
    },
    'GitHub PR': {
      url: prUrl,
    },
  };

  await notion.updatePage(task.id, properties);

  // Update Linear issue if exists
  const linearIssueId = extractLinearIssueId(task.properties['Linear Issue']);
  if (linearIssueId && isMerged) {
    try {
      // Find the Linear issue by identifier
      const issues = await linear.getIssues();
      const issue = issues.find(i => i.identifier === linearIssueId);
      if (issue) {
        const states = await linear.getStates(issue.project?.id || '');
        const doneState = states.find(s => s.type === 'completed' || s.name.toLowerCase() === 'done');
        if (doneState) {
          await linear.updateIssue(issue.id, { stateId: doneState.id });
        }
      }
    } catch (error) {
      console.warn(`Failed to update Linear issue for PR #${pr.number}:`, error.message);
    }
  }
}

async function markTaskComplete(notion, linear, task) {
  // Update Notion task status
  await notion.updatePage(task.id, {
    Status: {
      select: { name: 'Done' },
    },
  });

  // Update Linear issue if exists
  const linearIssueId = extractLinearIssueId(task.properties['Linear Issue']);
  if (linearIssueId) {
    try {
      const issues = await linear.getIssues();
      const issue = issues.find(i => i.identifier === linearIssueId);
      if (issue) {
        const states = await linear.getStates(issue.project?.id || '');
        const doneState = states.find(s => s.type === 'completed' || s.name.toLowerCase() === 'done');
        if (doneState) {
          await linear.updateIssue(issue.id, { stateId: doneState.id });
        }
      }
    } catch (error) {
      console.warn(`Failed to mark Linear issue complete:`, error.message);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  syncPRs()
    .then(result => {
      console.log('\n✅ PR sync complete!');
      console.log(`   Created: ${result.created}`);
      console.log(`   Updated: ${result.updated}`);
      console.log(`   Completed: ${result.completed}`);
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.length}`);
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ PR sync failed:', error.message);
      process.exit(1);
    });
}

module.exports = { syncPRs };

