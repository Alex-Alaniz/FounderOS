const LINEAR_IDENTIFIER_PATTERN = /[A-Z]{2,6}-\d+/g;

const normalize = (value) => (value || '').trim();

const mapNotionStatusToLinear = (status, stateMap = {}) => {
  const normalized = normalize(status);
  return stateMap[normalized] || stateMap[normalized.replace(/\s+/g, ' ')] || stateMap[normalized.toLowerCase()] || null;
};

const mapLinearStateToNotion = (stateName, reverseMap = {}) => {
  const normalized = normalize(stateName);
  const match = Object.entries(reverseMap).find(([, linearState]) => linearState === normalized);
  return match ? match[0] : null;
};

const mapNotionPriorityToLinear = (priority, priorityMap = {}) => {
  const normalized = normalize(priority);
  return priorityMap[normalized] ?? priorityMap[normalized.toUpperCase()] ?? null;
};

const mapLinearPriorityToNotion = (priority, reversePriorityMap = {}) => {
  const entry = Object.entries(reversePriorityMap).find(([, value]) => value === priority);
  return entry ? entry[0] : null;
};

const extractPlainText = (property) => {
  if (!property) return '';
  if (property.type === 'title') {
    return (property.title || []).map((item) => item.plain_text || '').join('').trim();
  }
  if (property.type === 'rich_text') {
    return (property.rich_text || []).map((item) => item.plain_text || '').join('').trim();
  }
  if (property.type === 'people') {
    return (property.people || []).map((person) => person.name || person.email).filter(Boolean).join(', ');
  }
  if (property.type === 'status' && property.status) return property.status.name;
  if (property.type === 'select' && property.select) return property.select.name;
  if (property.type === 'multi_select' && property.multi_select) {
    return property.multi_select.map((item) => item.name).join(', ');
  }
  return '';
};

const extractRelationIds = (property) => {
  if (!property || !Array.isArray(property.relation)) return [];
  return property.relation.map((relation) => relation.id);
};

const extractProductSlug = (property) => {
  if (!property || !property.relation || property.relation.length === 0) return null;
  // Use Notion relation IDs as-is; slug mapping handled elsewhere
  return property.relation[0].id;
};

const formatRichText = (value) => ({
  rich_text: [
    {
      text: { content: value },
    },
  ],
});

const formatTitle = (value) => ({
  title: [
    {
      text: { content: value },
    },
  ],
});

const formatSelect = (value, propertyType = 'select') => {
  if (!value) return null;
  if (propertyType === 'status') {
    return {
      status: {
        name: value,
      },
    };
  }
  return {
    select: {
      name: value,
    },
  };
};

const formatMultiSelect = (values) => ({
  multi_select: values.map((name) => ({ name })),
});

const formatRelation = (ids) => ({
  relation: ids.map((id) => ({ id })),
});

const extractLinearIdentifiers = (text) => {
  if (!text) return [];
  const matches = text.match(LINEAR_IDENTIFIER_PATTERN);
  if (!matches) return [];
  return [...new Set(matches)];
};

module.exports = {
  extractPlainText,
  extractRelationIds,
  extractProductSlug,
  formatRichText,
  formatTitle,
  formatSelect,
  formatMultiSelect,
  formatRelation,
  mapNotionStatusToLinear,
  mapLinearStateToNotion,
  mapNotionPriorityToLinear,
  mapLinearPriorityToNotion,
  extractLinearIdentifiers,
};

