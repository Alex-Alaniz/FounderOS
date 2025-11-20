#!/usr/bin/env node

/**
 * Daily Sync Orchestrator
 * Runs all automation scripts in sequence
 * 
 * Usage: node automation/daily-sync.js
 */

const { syncNotionToLinear } = require('./notion-to-linear');
const { syncLinearToNotion } = require('./linear-to-notion');
const { syncPRs } = require('./pr-sync');
const { assignTasks } = require('./task-manager');
const { Logger } = require('./utils');
const path = require('path');

async function runDailySync() {
  const logFile = path.join(__dirname, '../logs', `daily-sync-${new Date().toISOString().split('T')[0]}.log`);
  const logger = new Logger(logFile);

  const startTime = Date.now();
  logger.info('🚀 Starting FounderOS Daily Automation Loop');

  const results = {
    notionToLinear: null,
    linearToNotion: null,
    prSync: null,
    taskAssignment: null,
  };

  try {
    // Step 1: Sync Notion → Linear
    logger.info('Step 1/4: Syncing Notion → Linear');
    try {
      results.notionToLinear = await syncNotionToLinear();
      logger.success('Notion → Linear sync completed', results.notionToLinear);
    } catch (error) {
      logger.error('Notion → Linear sync failed', { error: error.message });
      results.notionToLinear = { error: error.message };
    }

    // Step 2: Sync Linear → Notion
    logger.info('Step 2/4: Syncing Linear → Notion');
    try {
      results.linearToNotion = await syncLinearToNotion();
      logger.success('Linear → Notion sync completed', results.linearToNotion);
    } catch (error) {
      logger.error('Linear → Notion sync failed', { error: error.message });
      results.linearToNotion = { error: error.message };
    }

    // Step 3: Sync GitHub PRs
    logger.info('Step 3/4: Syncing GitHub PRs');
    try {
      results.prSync = await syncPRs();
      logger.success('PR sync completed', results.prSync);
    } catch (error) {
      logger.error('PR sync failed', { error: error.message });
      results.prSync = { error: error.message };
    }

    // Step 4: Assign tasks to agents
    logger.info('Step 4/4: Assigning tasks to agents');
    try {
      results.taskAssignment = await assignTasks();
      logger.success('Task assignment completed', results.taskAssignment);
    } catch (error) {
      logger.error('Task assignment failed', { error: error.message });
      results.taskAssignment = { error: error.message };
    }

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info('✅ Daily sync complete', {
      duration: `${duration}s`,
      results,
    });

    // Generate summary report
    const summary = generateSummary(results);
    logger.info('Summary Report', summary);

    await logger.save();
    return results;
  } catch (error) {
    logger.error('Fatal error in daily sync', { error: error.message });
    await logger.save();
    throw error;
  }
}

function generateSummary(results) {
  const summary = {
    timestamp: new Date().toISOString(),
    steps: {
      'Notion → Linear': results.notionToLinear?.error 
        ? `❌ Error: ${results.notionToLinear.error}`
        : `✅ Created: ${results.notionToLinear?.created || 0}, Updated: ${results.notionToLinear?.updated || 0}`,
      'Linear → Notion': results.linearToNotion?.error
        ? `❌ Error: ${results.linearToNotion.error}`
        : `✅ Created: ${results.linearToNotion?.created || 0}, Updated: ${results.linearToNotion?.updated || 0}`,
      'PR Sync': results.prSync?.error
        ? `❌ Error: ${results.prSync.error}`
        : `✅ Created: ${results.prSync?.created || 0}, Updated: ${results.prSync?.updated || 0}, Completed: ${results.prSync?.completed || 0}`,
      'Task Assignment': results.taskAssignment?.error
        ? `❌ Error: ${results.taskAssignment.error}`
        : `✅ Assigned: ${results.taskAssignment?.assigned || 0} tasks`,
    },
  };

  return summary;
}

// Run if executed directly
if (require.main === module) {
  runDailySync()
    .then(results => {
      console.log('\n' + '='.repeat(60));
      console.log('✅ FounderOS Daily Automation Loop Complete');
      console.log('='.repeat(60));
      console.log('\nSummary:');
      console.log(`  Notion → Linear: ${results.notionToLinear?.created || 0} created, ${results.notionToLinear?.updated || 0} updated`);
      console.log(`  Linear → Notion: ${results.linearToNotion?.created || 0} created, ${results.linearToNotion?.updated || 0} updated`);
      console.log(`  PR Sync: ${results.prSync?.created || 0} created, ${results.prSync?.updated || 0} updated, ${results.prSync?.completed || 0} completed`);
      console.log(`  Task Assignment: ${results.taskAssignment?.assigned || 0} tasks assigned`);
      console.log('\n📋 Check logs/ directory for detailed execution logs\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Daily sync failed:', error.message);
      process.exit(1);
    });
}

module.exports = { runDailySync };

