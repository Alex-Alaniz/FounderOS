const {
  extractPlainText,
  extractRelationIds,
} = require('./mappers');

const mapTaskPage = (page) => {
  const props = page.properties || {};
  const statusProp = props.Status || props.Statuses;
  const priorityProp = props.Priority;
  const assigneeProp = props.Assignee || props.Owner;
  const productProp = props.Product || props.Products;
  const projectProp = props.Project || props.Projects;
  const linearProp = props['Linear Issue ID'] || props['Linear Issue'];
  const githubProp = props['GitHub PR'] || props['GitHub Link'];

  return {
    pageId: page.id,
    lastEditedTime: page.last_edited_time,
    name: extractPlainText(props.Name) || page.id,
    status: extractPlainText(statusProp),
    statusType: statusProp?.type,
    priority: extractPlainText(priorityProp),
    priorityType: priorityProp?.type,
    assigneeNames: assigneeProp?.people?.map((person) => person.name || person.email) || [],
    assigneeIds: extractRelationIds(assigneeProp),
    productIds: extractRelationIds(productProp),
    projectIds: extractRelationIds(projectProp),
    description: extractPlainText(props.Details || props.Description),
    dueDate: props['Due Date']?.date?.start || props.Due?.date?.start || null,
    linearIssueId: extractPlainText(linearProp),
    githubPr: extractPlainText(githubProp),
    raw: page,
  };
};

const mapTeamPage = (page) => ({
  id: page.id,
  name: extractPlainText(page.properties?.Name),
});

const chunk = (items, size = 50) => {
  const result = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
};

const loadTasksByLinearId = async (notion, databaseId) => {
  const tasks = [];
  let cursor;
  do {
    const response = await notion.queryDatabase(databaseId, {
      page_size: 50,
      filter: {
        property: 'Linear Issue ID',
        rich_text: {
          is_not_empty: true,
        },
      },
      start_cursor: cursor || undefined,
    });
    tasks.push(...response.results.map(mapTaskPage));
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);

  return tasks.reduce((acc, task) => {
    if (task.linearIssueId) acc[task.linearIssueId.trim()] = task;
    return acc;
  }, {});
};

module.exports = {
  mapTaskPage,
  mapTeamPage,
  chunk,
  loadTasksByLinearId,
};

