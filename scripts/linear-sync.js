#!/usr/bin/env node

/**
 * Linear Sync Script - Fetch and sync Linear issues to Notion
 * 
 * Usage:
 *   node scripts/linear-sync.js <api_key>
 * 
 * Or set environment variable:
 *   LINEAR_API_KEY=your_api_key node scripts/linear-sync.js
 */

const https = require('https');

const LINEAR_API_KEY = process.argv[2] || process.env.LINEAR_API_KEY;
const LINEAR_API_URL = 'https://api.linear.app/graphql';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: Linear API key required');
  console.error('   Usage: node scripts/linear-sync.js <api_key>');
  console.error('   Or set: LINEAR_API_KEY=your_key node scripts/linear-sync.js');
  process.exit(1);
}

// GraphQL query to fetch all active issues
const GET_ISSUES_QUERY = `
  query GetIssues($filter: IssueFilter) {
    issues(filter: $filter, first: 100) {
      nodes {
        id
        identifier
        title
        description
        state {
          name
          type
        }
        priority
        assignee {
          name
          email
        }
        project {
          name
        }
        labels {
          nodes {
            name
          }
        }
        dueDate
        createdAt
        updatedAt
        url
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    const dataBuffer = Buffer.from(data, 'utf8');
    
    const options = {
      hostname: 'api.linear.app',
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataBuffer.length,
        'Authorization': LINEAR_API_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${body.substring(0, 200)}`));
          return;
        }
        try {
          const result = JSON.parse(body);
          if (result.errors) {
            reject(new Error(JSON.stringify(result.errors, null, 2)));
          } else {
            resolve(result.data);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}\nResponse: ${body.substring(0, 500)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(dataBuffer);
    req.end();
  });
}

async function fetchAllIssues() {
  console.log('🔍 Fetching Linear issues...\n');
  
  try {
    const variables = {
      filter: {
        state: {
          type: { neq: "completed" }
        }
      }
    };
    
    const data = await makeGraphQLRequest(GET_ISSUES_QUERY, variables);
    const issues = data.issues.nodes;
    
    console.log(`✅ Successfully fetched ${issues.length} active Linear issues\n`);
    
    // Group by project
    const byProject = {};
    issues.forEach(issue => {
      const projectName = issue.project?.name || 'Unassigned';
      if (!byProject[projectName]) {
        byProject[projectName] = [];
      }
      byProject[projectName].push(issue);
    });
    
    // Display summary
    console.log('📊 Issue Summary:');
    console.log(`   Total Active Issues: ${issues.length}\n`);
    console.log('📁 Project Distribution:');
    Object.keys(byProject).forEach(project => {
      console.log(`   ${project}: ${byProject[project].length} issues`);
    });
    
    // State distribution
    const byState = {};
    issues.forEach(issue => {
      const stateName = issue.state?.name || 'Unknown';
      byState[stateName] = (byState[stateName] || 0) + 1;
    });
    
    console.log('\n📋 State Distribution:');
    Object.keys(byState).forEach(state => {
      console.log(`   ${state}: ${byState[state]} issues`);
    });
    
    // Priority distribution
    const byPriority = {};
    issues.forEach(issue => {
      const priority = issue.priority || 'None';
      byPriority[priority] = (byPriority[priority] || 0) + 1;
    });
    
    console.log('\n⚡ Priority Distribution:');
    Object.keys(byPriority).forEach(priority => {
      console.log(`   ${priority}: ${byPriority[priority]} issues`);
    });
    
    console.log('\n📝 Sample Issues (first 10):');
    issues.slice(0, 10).forEach(issue => {
      console.log(`\n   ${issue.identifier}: ${issue.title}`);
      console.log(`      State: ${issue.state?.name || 'Unknown'}`);
      console.log(`      Priority: ${issue.priority || 'None'}`);
      console.log(`      Project: ${issue.project?.name || 'Unassigned'}`);
      console.log(`      URL: ${issue.url}`);
    });
    
    return issues;
  } catch (error) {
    console.error('❌ Error fetching issues:', error.message);
    throw error;
  }
}

// Main execution
(async () => {
  try {
    console.log('🚀 Linear Sync Script\n');
    console.log(`📡 Connecting to Linear API...\n`);
    
    const issues = await fetchAllIssues();
    
    console.log('\n✅ Sync complete!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Review the issues above');
    console.log('   2. Sync to Notion database: https://www.notion.so/a256468f56d145f0a17d4ed8628daeaa');
    console.log('   3. Use Notion MCP API to create/update pages');
    console.log('\n💡 For automated sync, integrate this script with Notion API');
    
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
})();

