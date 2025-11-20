const fs = require('node:fs/promises');
const path = require('node:path');

class AutomationLogger {
  constructor({ filePath, timezone = 'UTC' }) {
    this.filePath = filePath;
    this.timezone = timezone;
  }

  async ensureFile() {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch {
      const header = '# Automation Daily Log\n\n';
      await fs.writeFile(this.filePath, header, 'utf8');
    }
  }

  formatDate(date = new Date()) {
    return date.toLocaleString('en-US', {
      timeZone: this.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  static formatList(label, value) {
    if (value === undefined) return null;
    if (typeof value === 'object' && value !== null) {
      return `- **${label}:** ${JSON.stringify(value)}`;
    }
    return `- **${label}:** ${value}`;
  }

  async log(scriptName, payload = {}) {
    await this.ensureFile();
    const timestamp = this.formatDate();
    const lines = [`\n## ${timestamp} — ${scriptName}\n`];

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value) && value.length === 0) return;

      if (Array.isArray(value)) {
        lines.push(`- **${key}:**`);
        value.forEach((entry) => {
          lines.push(`  - ${typeof entry === 'string' ? entry : JSON.stringify(entry)}`);
        });
      } else if (typeof value === 'object') {
        lines.push(`- **${key}:** ${JSON.stringify(value)}`);
      } else {
        lines.push(`- **${key}:** ${value}`);
      }
    });

    lines.push('');
    await fs.appendFile(this.filePath, lines.join('\n'), 'utf8');
  }
}

module.exports = AutomationLogger;

