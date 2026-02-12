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
  
  // Timestamp
  if (timestamp) {
    parts.push(`[${entry.timestamp}]`);
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
  
  // Timestamp with dim color
  if (colors) {
    parts.push(`${LogColors.dim}${entry.timestamp}${LogColors.reset}`);
  } else {
    parts.push(entry.timestamp);
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
  
  // Core fields
  kvPairs.push(`timestamp="${entry.timestamp}"`);
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
