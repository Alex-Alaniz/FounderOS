#!/usr/bin/env node

/**
 * Linear to Notion Sync Script
 * Syncs Linear issues to Notion Linear Issues database
 * 
 * Usage:
 *   node scripts/linear-to-notion-sync.js <api_key>
 * 
 * Or set environment variable:
 *   LINEAR_API_KEY=your_api_key node scripts/linear-to-notion-sync.js
 */

const https = require('https');

const LINEAR_API_KEY = process.argv[2] || process.env.LINEAR_API_KEY;
const LINEAR_API_URL = 'https://api.linear.app/graphql';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: Linear API key required');
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
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(dataBuffer);
    req.end();
  });
}

async function fetchLinearIssues() {
  console.log('🔍 Fetching Linear issues...\n');
  
  const variables = {
    filter: {
      state: {
        type: { neq: "completed" }
      }
    }
  };
  
  const data = await makeGraphQLRequest(GET_ISSUES_QUERY, variables);
  return data.issues.nodes;
}

// Map Linear priority to Notion priority
// Linear priority: 1=Urgent, 2=High, 3=Medium, 4=Low, null/undefined=None
function mapPriority(linearPriority) {
  if (linearPriority === null || linearPriority === undefined) return 'None';
  const mapping = {
    1: 'Urgent',
    2: 'High',
    3: 'Medium',
    4: 'Low'
  };
  return mapping[linearPriority] || 'None';
}

// Map Linear state to Notion state
function mapState(linearState) {
  const mapping = {
    'backlog': 'Backlog',
    'todo': 'Todo',
    'in progress': 'In Progress',
    'in review': 'In Review',
    'done': 'Done',
    'canceled': 'Canceled'
  };
  return mapping[linearState?.toLowerCase()] || 'Todo';
}

// Map Linear labels to Notion labels
function mapLabels(linearLabels) {
  if (!linearLabels || !linearLabels.nodes) return [];
  return linearLabels.nodes.map(node => node.name.toLowerCase());
}

// Format date for Notion
function formatDate(dateString) {
  if (!dateString) return null;
  return dateString.split('T')[0]; // Return YYYY-MM-DD format
}

async function prepareIssuesForNotion(issues) {
  console.log(`📝 Preparing ${issues.length} issues for Notion sync...\n`);
  
  return issues.map(issue => {
    const labels = mapLabels(issue.labels);
    
    return {
      identifier: issue.identifier,
      title: issue.title,
      description: issue.description || '',
      state: mapState(issue.state?.name),
      priority: mapPriority(issue.priority),
      assignee: issue.assignee?.name || null,
      project: issue.project?.name || null,
      labels: labels,
      dueDate: formatDate(issue.dueDate),
      linearUrl: issue.url,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt
    };
  });
}

// Main execution
(async () => {
  try {
    console.log('🚀 Linear to Notion Sync Script\n');
    
    const issues = await fetchLinearIssues();
    console.log(`✅ Fetched ${issues.length} Linear issues\n`);
    
    const preparedIssues = await prepareIssuesForNotion(issues);
    
    console.log('📊 Issue Summary:');
    console.log(`   Total Active Issues: ${issues.length}`);
    
    const byProject = {};
    preparedIssues.forEach(issue => {
      const project = issue.project || 'Unassigned';
      byProject[project] = (byProject[project] || 0) + 1;
    });
    
    console.log('\n📁 Project Distribution:');
    Object.keys(byProject).forEach(project => {
      console.log(`   ${project}: ${byProject[project]} issues`);
    });
    
    console.log('\n📋 Sample Issues (first 10):');
    preparedIssues.slice(0, 10).forEach(issue => {
      console.log(`\n   ${issue.identifier}: ${issue.title}`);
      console.log(`      State: ${issue.state}`);
      console.log(`      Priority: ${issue.priority}`);
      console.log(`      Project: ${issue.project || 'Unassigned'}`);
      console.log(`      URL: ${issue.linearUrl}`);
    });
    
    console.log('\n✅ Issues prepared for Notion sync!');
    console.log('\n📋 Next Steps:');
    console.log('   Use Notion MCP API to create pages in Linear Issues database');
    console.log('   Database URL: https://www.notion.so/a256468f56d145f0a17d4ed8628daeaa');
    console.log(`\n💡 Ready to sync ${preparedIssues.length} issues to Notion`);
    
    // Export for use by other scripts
    return preparedIssues;
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
})();

