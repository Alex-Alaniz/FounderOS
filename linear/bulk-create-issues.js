#!/usr/bin/env node

/**
 * Bulk create Linear issues from JSON file
 * Uses Linear GraphQL API
 * 
 * Usage:
 *   LINEAR_API_KEY=your_key node bulk-create-issues.js bulk-step4-issues.json
 */

const fs = require('fs');
const https = require('https');

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_API_URL = 'https://api.linear.app/graphql';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable is required');
  console.error('   Set it with: export LINEAR_API_KEY=your_key');
  process.exit(1);
}

// GraphQL query to get team ID by name
const GET_TEAM_QUERY = `
  query GetTeam($filter: TeamFilter) {
    teams(filter: $filter) {
      nodes {
        id
        name
        key
      }
    }
  }
`;

// GraphQL query to get project ID by name
const GET_PROJECT_QUERY = `
  query GetProject($filter: ProjectFilter) {
    projects(filter: $filter) {
      nodes {
        id
        name
      }
    }
  }
`;

// GraphQL mutation to create an issue
const CREATE_ISSUE_MUTATION = `
  mutation CreateIssue($input: IssueCreateInput!) {
    issueCreate(input: $input) {
      success
      issue {
        id
        identifier
        title
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
          reject(new Error(`Parse error: ${e.message}\nResponse: ${body.substring(0, 500)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(dataBuffer);
    req.end();
  });
}

async function getTeamId(teamName) {
  console.log(`🔍 Looking up team: "${teamName}"...`);
  const data = await makeGraphQLRequest(GET_TEAM_QUERY, {
    filter: { name: { eq: teamName } }
  });
  
  if (data.teams.nodes.length === 0) {
    throw new Error(`Team "${teamName}" not found. Available teams: ${JSON.stringify(data.teams.nodes.map(t => t.name))}`);
  }
  
  const team = data.teams.nodes[0];
  console.log(`✅ Found team: ${team.name} (${team.key}) - ID: ${team.id}`);
  return team.id;
}

async function getProjectId(projectName, teamId) {
  console.log(`🔍 Looking up project: "${projectName}"...`);
  try {
    const data = await makeGraphQLRequest(GET_PROJECT_QUERY, {
      filter: { 
        name: { eq: projectName },
        team: { id: { eq: teamId } }
      }
    });
    
    if (!data || !data.projects || !data.projects.nodes || data.projects.nodes.length === 0) {
      console.warn(`⚠️  Project "${projectName}" not found. Will create issues without project assignment.`);
      return null;
    }
    
    const project = data.projects.nodes[0];
    console.log(`✅ Found project: ${project.name} - ID: ${project.id}`);
    return project.id;
  } catch (error) {
    console.warn(`⚠️  Error looking up project "${projectName}": ${error.message}`);
    console.warn(`   Will create issues without project assignment.`);
    return null;
  }
}

async function createIssue(title, teamId, projectId) {
  const input = {
    title,
    teamId,
  };
  
  if (projectId) {
    input.projectId = projectId;
  }
  
  const data = await makeGraphQLRequest(CREATE_ISSUE_MUTATION, { input });
  
  if (data.issueCreate.success) {
    return data.issueCreate.issue;
  } else {
    throw new Error(`Failed to create issue: ${title}`);
  }
}

async function main() {
  const jsonFile = process.argv[2] || 'bulk-step4-issues.json';
  
  if (!fs.existsSync(jsonFile)) {
    console.error(`❌ Error: File "${jsonFile}" not found`);
    process.exit(1);
  }
  
  const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  const issues = jsonData.issues || [];
  
  if (issues.length === 0) {
    console.error('❌ Error: No issues found in JSON file');
    process.exit(1);
  }
  
  console.log(`📋 Found ${issues.length} issues to create\n`);
  
  // Get team and project IDs (assuming all issues use the same team/project)
  const firstIssue = issues[0];
  const teamName = firstIssue.team;
  const projectName = firstIssue.project;
  
  let teamId, projectId;
  
  try {
    teamId = await getTeamId(teamName);
    projectId = await getProjectId(projectName, teamId);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
  
  console.log(`\n🚀 Creating ${issues.length} issues...\n`);
  
  const results = {
    success: [],
    failed: []
  };
  
  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    const num = i + 1;
    
    try {
      console.log(`[${num}/${issues.length}] Creating: "${issue.title}"`);
      const created = await createIssue(issue.title, teamId, projectId);
      console.log(`   ✅ Created: ${created.identifier} - ${created.url}\n`);
      results.success.push({ ...issue, linearIssue: created });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}\n`);
      results.failed.push({ ...issue, error: error.message });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully created: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed issues:');
    results.failed.forEach(issue => {
      console.log(`  - ${issue.title}: ${issue.error}`);
    });
  }
  
  // Save results
  const resultsFile = jsonFile.replace('.json', '-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${resultsFile}`);
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});

