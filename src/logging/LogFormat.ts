/**
 * @dev-ecosystem/core - Log Formatting Utilities
 * 
 * Provides consistent log formatting across all ecosystem products.
 * Supports multiple output formats (JSON, text, structured) and log levels.
 */

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Numeric severity for log levels
 */
export const LogLevelSeverity: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.FATAL]: 4,
};

/**
 * ANSI color codes for terminal output
 */
export const LogColors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

/**
 * Color mapping for log levels
 */
export const LogLevelColors: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: LogColors.cyan,
  [LogLevel.INFO]: LogColors.blue,
  [LogLevel.WARN]: LogColors.yellow,
  [LogLevel.ERROR]: LogColors.red,
  [LogLevel.FATAL]: LogColors.magenta,
};

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
  metadata?: Record<string, unknown>;
  tags?: string[];
  source?: string;
}

/**
 * Log format options
 */
export interface LogFormatOptions {
  format?: 'json' | 'text' | 'pretty' | 'structured';
  colors?: boolean;
  timestamp?: boolean;
  includeSource?: boolean;
  indent?: number;
  maxDepth?: number;
}

/**
 * Format a log entry as JSON
 */
export function formatJSON(entry: LogEntry, options: LogFormatOptions = {}): string {
  const { indent = 0 } = options;

  const output: Record<string, unknown> = {
    timestamp: entry.timestamp,
    level: entry.level,
    message: entry.message,
  };

  if (entry.source) {
    output.source = entry.source;
  }

  if (entry.context && Object.keys(entry.context).length > 0) {
    output.context = entry.context;
  }

  if (entry.metadata && Object.keys(entry.metadata).length > 0) {
    output.metadata = entry.metadata;
  }

  if (entry.tags && entry.tags.length > 0) {
    output.tags = entry.tags;
  }

  if (entry.error) {
    output.error = {
      name: entry.error.name,
      message: entry.error.message,
      stack: entry.error.stack,
    };
  }

  return JSON.stringify(output, null, indent || undefined);
}

/**
 * Format a log entry as plain text
 */
export function formatText(entry: LogEntry, options: LogFormatOptions = {}): string {
  const { colors = false, timestamp = true, includeSource = true } = options;

  const parts: string[] = [];

  // Timestamp (human-readable format)
  if (timestamp) {
    parts.push(`[${formatTimestamp(entry.timestamp, 'time')}]`);
  }

  // Level
  const levelStr = entry.level.toUpperCase().padEnd(5);
  if (colors) {
    const color = LogLevelColors[entry.level];
    parts.push(`${color}${levelStr}${LogColors.reset}`);
  } else {
    parts.push(levelStr);
  }

  // Source
  if (includeSource && entry.source) {
    parts.push(`[${entry.source}]`);
  }

  // Message
  parts.push(entry.message);

  let output = parts.join(' ');

  // Context
  if (entry.context && Object.keys(entry.context).length > 0) {
    output += `\n  Context: ${JSON.stringify(entry.context)}`;
  }

  // Metadata
  if (entry.metadata && Object.keys(entry.metadata).length > 0) {
    output += `\n  Metadata: ${JSON.stringify(entry.metadata)}`;
  }

  // Tags
  if (entry.tags && entry.tags.length > 0) {
    output += `\n  Tags: ${entry.tags.join(', ')}`;
  }

  // Error
  if (entry.error) {
    output += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
    if (entry.error.stack) {
      output += `\n${entry.error.stack}`;
    }
  }

  return output;
}

/**
 * Format a log entry with pretty colors and indentation
 */
export function formatPretty(entry: LogEntry, options: LogFormatOptions = {}): string {
  const { colors = true } = options;

  const parts: string[] = [];

  // Timestamp with dim color (human-readable format)
  const readableTimestamp = formatTimestamp(entry.timestamp, 'time');
  if (colors) {
    parts.push(`${LogColors.dim}${readableTimestamp}${LogColors.reset}`);
  } else {
    parts.push(readableTimestamp);
  }

  // Level with color and icon
  const levelIcons: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: '🐛',
    [LogLevel.INFO]: 'ℹ️ ',
    [LogLevel.WARN]: '⚠️ ',
    [LogLevel.ERROR]: '❌',
    [LogLevel.FATAL]: '💀',
  };

  const icon = levelIcons[entry.level];
  const levelStr = entry.level.toUpperCase();

  if (colors) {
    const color = LogLevelColors[entry.level];
    parts.push(`${icon} ${color}${levelStr}${LogColors.reset}`);
  } else {
    parts.push(`${icon} ${levelStr}`);
  }

  // Source with brackets
  if (entry.source) {
    if (colors) {
      parts.push(`${LogColors.cyan}[${entry.source}]${LogColors.reset}`);
    } else {
      parts.push(`[${entry.source}]`);
    }
  }

  // Message with bright color
  if (colors) {
    parts.push(`${LogColors.bright}${entry.message}${LogColors.reset}`);
  } else {
    parts.push(entry.message);
  }

  let output = parts.join(' ');

  // Context with indentation
  if (entry.context && Object.keys(entry.context).length > 0) {
    const contextStr = JSON.stringify(entry.context, null, 2)
      .split('\n')
      .map(line => `  ${line}`)
      .join('\n');

    if (colors) {
      output += `\n${LogColors.dim}Context:${LogColors.reset}\n${contextStr}`;
    } else {
      output += `\nContext:\n${contextStr}`;
    }
  }

  // Metadata
  if (entry.metadata && Object.keys(entry.metadata).length > 0) {
    const metadataStr = JSON.stringify(entry.metadata, null, 2)
      .split('\n')
      .map(line => `  ${line}`)
      .join('\n');

    if (colors) {
      output += `\n${LogColors.dim}Metadata:${LogColors.reset}\n${metadataStr}`;
    } else {
      output += `\nMetadata:\n${metadataStr}`;
    }
  }

  // Tags with color
  if (entry.tags && entry.tags.length > 0) {
    const tagsStr = entry.tags.map(tag => `#${tag}`).join(' ');
    if (colors) {
      output += `\n${LogColors.dim}Tags:${LogColors.reset} ${LogColors.cyan}${tagsStr}${LogColors.reset}`;
    } else {
      output += `\nTags: ${tagsStr}`;
    }
  }

  // Error with red color
  if (entry.error) {
    if (colors) {
      output += `\n${LogColors.red}Error: ${entry.error.name}: ${entry.error.message}${LogColors.reset}`;
    } else {
      output += `\nError: ${entry.error.name}: ${entry.error.message}`;
    }

    if (entry.error.stack) {
      const stackLines = entry.error.stack.split('\n').slice(1); // Skip first line (already shown)
      const formattedStack = stackLines
        .map(line => `  ${line.trim()}`)
        .join('\n');

      if (colors) {
        output += `\n${LogColors.dim}${formattedStack}${LogColors.reset}`;
      } else {
        output += `\n${formattedStack}`;
      }
    }
  }

  return output;
}

/**
 * Format a log entry with structured key-value pairs
 */
export function formatStructured(entry: LogEntry, options: LogFormatOptions = {}): string {
  const { colors = false } = options;

  const kvPairs: string[] = [];

  // Core fields (use readable timestamp)
  kvPairs.push(`timestamp="${formatTimestamp(entry.timestamp, 'full')}"`);
  kvPairs.push(`level="${entry.level}"`);
  kvPairs.push(`message="${entry.message}"`);

  if (entry.source) {
    kvPairs.push(`source="${entry.source}"`);
  }

  // Context fields
  if (entry.context) {
    for (const [key, value] of Object.entries(entry.context)) {
      kvPairs.push(`context.${key}="${JSON.stringify(value)}"`);
    }
  }

  // Metadata fields
  if (entry.metadata) {
    for (const [key, value] of Object.entries(entry.metadata)) {
      kvPairs.push(`metadata.${key}="${JSON.stringify(value)}"`);
    }
  }

  // Tags
  if (entry.tags && entry.tags.length > 0) {
    kvPairs.push(`tags="${entry.tags.join(',')}"`);
  }

  // Error
  if (entry.error) {
    kvPairs.push(`error.name="${entry.error.name}"`);
    kvPairs.push(`error.message="${entry.error.message}"`);
  }

  let output = kvPairs.join(' ');

  // Apply colors to level
  if (colors) {
    const levelPattern = /level="(\w+)"/;
    output = output.replace(levelPattern, (_match, level) => {
      const color = LogLevelColors[level as LogLevel] || '';
      return `${color}level="${level}"${LogColors.reset}`;
    });
  }

  return output;
}

/**
 * Main log formatting function
 */
export function formatLog(entry: LogEntry, options: LogFormatOptions = {}): string {
  const { format = 'pretty' } = options;

  switch (format) {
    case 'json':
      return formatJSON(entry, options);
    case 'text':
      return formatText(entry, options);
    case 'pretty':
      return formatPretty(entry, options);
    case 'structured':
      return formatStructured(entry, options);
    default:
      return formatPretty(entry, options);
  }
}

/**
 * Create a log entry with current timestamp
 */
export function createLogEntry(
  level: LogLevel,
  message: string,
  options: Partial<Omit<LogEntry, 'timestamp' | 'level' | 'message'>> = {}
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...options,
  };
}

/**
 * Check if a log level should be logged based on minimum level
 */
export function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
  return LogLevelSeverity[level] >= LogLevelSeverity[minLevel];
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Redact sensitive information from logs
 */
export function redactSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = [
    'password',
    'secret',
    'token',
    'apiKey',
    'api_key',
    'accessToken',
    'access_token',
    'privateKey',
    'private_key',
    'creditCard',
    'ssn',
  ];

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some(sk => lowerKey.includes(sk.toLowerCase()));

    if (isSensitive) {
      result[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = redactSensitive(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Status symbols for workflow execution
 */
export const StatusSymbols = {
  // Execution states
  pending: '○',
  running: '●',
  success: '✔',
  failure: '✖',
  skipped: '⊘',
  warning: '⚠',

  // Workflow elements
  workflow: '▶',
  step: '►',
  substep: '▸',

  // Progress
  spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],

  // Decorative
  arrow: '→',
  bullet: '•',
  check: '✓',
  cross: '✗',
  info: 'ℹ',

  // Box drawing
  box: {
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
    verticalRight: '├',
    verticalLeft: '┤',
    horizontalDown: '┬',
    horizontalUp: '┴',
    cross: '┼',
  },
} as const;

/**
 * Format timestamp in human-readable format
 * 
 * Converts Date or ISO string to readable time format.
 * 
 * @param timestamp - Date object or ISO string
 * @param format - Format style: 'time' (13:08:21), 'datetime' (Feb 15, 13:08:21), 'full' (2026-02-15 13:08:21)
 * @returns Formatted timestamp string
 * 
 * @example
 * formatTimestamp(new Date()) // "13:08:21"
 * formatTimestamp(new Date(), 'datetime') // "Feb 15, 13:08:21"
 * formatTimestamp(new Date(), 'full') // "2026-02-15 13:08:21"
 */
export function formatTimestamp(
  timestamp: Date | string,
  format: 'time' | 'datetime' | 'full' = 'time'
): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}:${seconds}`;

  if (format === 'time') {
    return timeStr;
  }

  if (format === 'datetime') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}, ${timeStr}`;
  }

  if (format === 'full') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${timeStr}`;
  }

  return timeStr;
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  } else if (ms < 3600000) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  } else {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }
}

/**
 * Format bytes in human-readable format
 */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Align text with padding
 */
export function alignText(text: string, width: number, align: 'left' | 'right' | 'center' = 'left'): string {
  if (text.length >= width) {
    return text;
  }

  const padding = width - text.length;

  switch (align) {
    case 'left':
      return text + ' '.repeat(padding);
    case 'right':
      return ' '.repeat(padding) + text;
    case 'center':
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
    default:
      return text;
  }
}

/**
 * Create a horizontal divider
 */
export function divider(width: number = 60, char: string = '─'): string {
  return char.repeat(width);
}

/**
 * Create a box around text
 */
export function box(text: string, options: { width?: number; padding?: number } = {}): string {
  const { width = 60, padding = 1 } = options;
  const lines = text.split('\n');
  const contentWidth = width - 4; // Account for borders and padding

  const { box: boxChars } = StatusSymbols;
  const paddingStr = ' '.repeat(padding);

  const result: string[] = [];

  // Top border
  result.push(boxChars.topLeft + boxChars.horizontal.repeat(width - 2) + boxChars.topRight);

  // Content lines
  for (const line of lines) {
    const paddedLine = alignText(line, contentWidth, 'left');
    result.push(boxChars.vertical + paddingStr + paddedLine + paddingStr + boxChars.vertical);
  }

  // Bottom border
  result.push(boxChars.bottomLeft + boxChars.horizontal.repeat(width - 2) + boxChars.bottomRight);

  return result.join('\n');
}

/**
 * Apply color to text if colors are enabled
 */
export function colorize(text: string, color: string, enabled: boolean = true): string {
  if (!enabled) {
    return text;
  }
  return `${color}${text}${LogColors.reset}`;
}

/**
 * Create a status indicator with color
 */
export function statusIndicator(
  status: 'pending' | 'running' | 'success' | 'failure' | 'skipped' | 'warning',
  colors: boolean = true
): string {
  const symbol = StatusSymbols[status];

  if (!colors) {
    return symbol;
  }

  const colorMap = {
    pending: LogColors.dim,
    running: LogColors.blue,
    success: LogColors.green,
    failure: LogColors.red,
    skipped: LogColors.yellow,
    warning: LogColors.yellow,
  };

  return colorize(symbol, colorMap[status], colors);
}

/**
 * Format a step execution line
 */
export function formatStepLine(
  stepId: string,
  status: 'pending' | 'running' | 'success' | 'failure' | 'skipped',
  adapter?: string,
  duration?: number,
  colors: boolean = true
): string {
  const indicator = statusIndicator(status, colors);
  const stepName = colors ? colorize(stepId, LogColors.bright, colors) : stepId;

  let line = `${indicator} ${stepName}`;

  if (adapter) {
    const adapterText = colors ? colorize(adapter, LogColors.dim, colors) : adapter;
    line += ` ${StatusSymbols.arrow} ${adapterText}`;
  }

  if (duration !== undefined) {
    const durationText = formatDuration(duration);
    const durationColored = colors ? colorize(durationText, LogColors.dim, colors) : durationText;
    line += ` (${durationColored})`;
  }

  return line;
}

/**
 * Create a section header
 */
export function sectionHeader(title: string, colors: boolean = true): string {
  const decorated = `${StatusSymbols.workflow} ${title}`;
  return colors ? colorize(decorated, LogColors.bright + LogColors.cyan, colors) : decorated;
}

/**
 * Format key-value pairs
 */
export function formatKeyValue(
  key: string,
  value: string | number | boolean,
  colors: boolean = true
): string {
  const keyText = colors ? colorize(key, LogColors.dim, colors) : key;
  const valueText = colors ? colorize(String(value), LogColors.bright, colors) : String(value);
  return `${keyText}: ${valueText}`;
}

/**
 * Create a summary table
 */
export interface SummaryRow {
  label: string;
  value: string | number;
  color?: string;
}

export function formatSummary(rows: SummaryRow[], colors: boolean = true): string {
  const maxLabelWidth = Math.max(...rows.map(r => r.label.length));

  return rows.map(row => {
    const label = alignText(row.label, maxLabelWidth, 'left');
    const labelText = colors ? colorize(label, LogColors.dim, colors) : label;

    let valueText = String(row.value);
    if (colors && row.color) {
      valueText = colorize(valueText, row.color, colors);
    } else if (colors) {
      valueText = colorize(valueText, LogColors.bright, colors);
    }

    return `  ${labelText}  ${valueText}`;
  }).join('\n');
}

/**
 * Format a percentage with color coding
 */
export function formatPercentage(value: number, total: number, colors: boolean = true): string {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
  const text = `${percentage}%`;

  if (!colors) {
    return text;
  }

  const percent = parseFloat(percentage);
  let color = LogColors.green;

  if (percent < 50) {
    color = LogColors.red;
  } else if (percent < 80) {
    color = LogColors.yellow;
  }

  return colorize(text, color, colors);
}
