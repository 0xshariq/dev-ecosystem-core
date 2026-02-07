# Exit Code Reference

This document provides comprehensive documentation for all ecosystem exit codes. Exit codes are numeric values returned when a process terminates, indicating the reason for termination.

## Exit Code Ranges

| Range | Category | Description |
|-------|----------|-------------|
| **0** | Success | Process completed successfully |
| **1xx** | User Errors | Problems caused by user input or actions |
| **2xx** | Configuration Errors | Issues with configuration files or settings |
| **3xx** | Execution Errors | Runtime failures during task execution |
| **4xx** | Security Errors | Authentication, authorization, or security violations |
| **5xx** | Internal Errors | System-level failures or bugs |

---

## Success (0)

### Exit Code: **0**
- **Name**: `SUCCESS`
- **Category**: Success
- **Retryable**: No

**Meaning**: The process completed successfully without any errors.

**When It Occurs**:
- Workflow executed all steps successfully
- Command completed its intended operation
- All validations passed

**Resolution**: None needed - this indicates success!

---

## User Errors (100-105)

### Exit Code: **100**
- **Name**: `INVALID_INPUT`
- **Category**: User Error
- **Retryable**: No

**Meaning**: The user provided invalid or malformed input.

**Common Causes**:
- Invalid workflow YAML syntax
- Missing required input parameters
- Incorrect command-line arguments
- Invalid file paths provided

**Resolution**:
- Review the error message for specific validation failures
- Check input format against documentation
- Verify all required fields are present
- Use `--help` flag to see expected input format

**Examples**:
```bash
# Missing required input
orbyt run workflow.yaml --input name=  # ERROR: Empty value

# Invalid format
orbyt run invalid.yaml  # ERROR: YAML syntax error
```

---

### Exit Code: **101**
- **Name**: `INVALID_FILE`
- **Category**: User Error
- **Retryable**: No

**Meaning**: The specified file is invalid, corrupted, or in an unsupported format.

**Common Causes**:
- Corrupted media files
- Unsupported file format
- File truncated or incomplete
- Binary file where text expected

**Resolution**:
- Verify file integrity (checksums)
- Convert file to supported format
- Re-download or re-create the file
- Check file isn't empty or truncated

**Examples**:
```bash
# Corrupted image file
mediaproc resize corrupted.jpg --width 800  # ERROR: Cannot read image

# Unsupported format
mediaproc transcode video.mkv --codec av1  # ERROR: Format not supported
```

---

### Exit Code: **102**
- **Name**: `INVALID_FORMAT`
- **Category**: User Error
- **Retryable**: No

**Meaning**: The file format doesn't match the expected format.

**Common Causes**:
- JSON file with YAML extension
- Wrong media codec
- Incorrect file extension
- Schema version mismatch

**Resolution**:
- Verify file extension matches content
- Convert to expected format
- Check tool supports the format version
- Update configuration to specify correct format

---

### Exit Code: **103**
- **Name**: `INVALID_SCHEMA`
- **Category**: User Error
- **Retryable**: No

**Meaning**: The data doesn't conform to the required schema.

**Common Causes**:
- Workflow YAML missing required fields
- JSON doesn't match JSON Schema
- Type mismatches (string vs number)
- Schema version incompatibility

**Resolution**:
- Validate against schema: `orbyt validate workflow.yaml`
- Review schema documentation
- Check for typos in field names
- Ensure all required fields present
- Verify data types match schema

**Examples**:
```yaml
# Missing required 'steps' field
version: "1.0"
kind: orbyt-workflow
metadata:
  name: example
# ERROR: 'steps' field required
```

---

### Exit Code: **104**
- **Name**: `FILE_NOT_FOUND`
- **Category**: User Error
- **Retryable**: No

**Meaning**: A required file couldn't be found at the specified path.

**Common Causes**:
- Typo in file path
- Relative path from wrong directory
- File was deleted or moved
- Incorrect working directory

**Resolution**:
- Verify file exists: `ls -la <path>`
- Check current directory: `pwd`
- Use absolute paths when possible
- Verify file permissions (readable)

---

### Exit Code: **105**
- **Name**: `PERMISSION_DENIED`
- **Category**: User Error
- **Retryable**: No

**Meaning**: Insufficient permissions to access the requested resource.

**Common Causes**:
- No read permission on file
- No write permission on directory
- File owned by another user
- SELinux or ACL restrictions

**Resolution**:
- Check file permissions: `ls -la <file>`
- Grant appropriate permissions: `chmod +r <file>`
- Run with appropriate user/group
- Contact system administrator if needed

---

## Configuration Errors (200-205)

### Exit Code: **200**
- **Name**: `MISSING_CONFIG`
- **Category**: Configuration Error
- **Retryable**: No

**Meaning**: A required configuration file is missing.

**Common Causes**:
- Tool not initialized
- Configuration file deleted
- Running from wrong directory
- Configuration migration incomplete

**Resolution**:
- Initialize tool: `<tool> init`
- Create default config: `<tool> config generate`
- Check for config in expected locations
- Restore from backup if available

**Examples**:
```bash
# Vaulta not initialized
vaulta get API_KEY  # ERROR: Vault not initialized
# Resolution:
vaulta init
```

---

### Exit Code: **201**
- **Name**: `INVALID_CONFIG`
- **Category**: Configuration Error
- **Retryable**: No

**Meaning**: The configuration file exists but contains invalid settings.

**Common Causes**:
- Syntax errors in config file
- Invalid values for settings
- Missing required configuration fields
- Incompatible setting combinations

**Resolution**:
- Validate config: `<tool> config validate`
- Review config documentation
- Reset to defaults: `<tool> config reset`
- Check for typos in keys/values

---

### Exit Code: **202**
- **Name**: `MISSING_DEPENDENCY`
- **Category**: Configuration Error
- **Retryable**: Yes (after installing)

**Meaning**: A required external dependency or tool is not installed.

**Common Causes**:
- Missing system library
- Adapter not installed
- Required command not in PATH
- Version mismatch

**Resolution**:
- Install missing dependency
- Add tool to PATH
- Update to compatible version
- Check system requirements documentation

**Examples**:
```bash
# FFmpeg not installed
mediaproc transcode video.mp4  # ERROR: ffmpeg not found
# Resolution:
sudo apt install ffmpeg  # or brew install ffmpeg
```

---

### Exit Code: **203**
- **Name**: `ENV_VAR_MISSING`
- **Category**: Configuration Error
- **Retryable**: Yes (after setting)

**Meaning**: A required environment variable is not set.

**Common Causes**:
- Variable not exported
- Shell configuration not loaded
- Typo in variable name
- Variable unset after configuration

**Resolution**:
- Set the variable: `export VAR_NAME=value`
- Add to shell profile (~/.bashrc, ~/.zshrc)
- Check .env file loaded
- Verify variable name spelling

---

### Exit Code: **204**
- **Name**: `CONFIG_VALIDATION_FAILED`
- **Category**: Configuration Error
- **Retryable**: No

**Meaning**: Configuration validation failed with specific errors.

**Common Causes**:
- Conflicting settings
- Out-of-range values
- Mutually exclusive options enabled
- Schema validation failure

**Resolution**:
- Read validation error messages carefully
- Fix reported issues one by one
- Ensure setting values within allowed ranges
- Check for deprecated settings

---

### Exit Code: **205**
- **Name**: `WORKSPACE_INVALID`
- **Category**: Configuration Error
- **Retryable**: No

**Meaning**: The workspace is not properly configured or initialized.

**Common Causes**:
- Not in a valid workspace directory
- Workspace corrupted
- Missing workspace metadata
- Incompatible workspace version

**Resolution**:
- Run from workspace root
- Re-initialize workspace: `<tool> workspace init`
- Restore from backup
- Migrate workspace: `<tool> workspace migrate`

---

## Execution Errors (300-307)

### Exit Code: **300**
- **Name**: `STEP_FAILED`
- **Category**: Execution Error
- **Retryable**: Yes

**Meaning**: A workflow step failed during execution.

**Common Causes**:
- Adapter returned error
- Command exited non-zero
- Network request failed
- Resource unavailable

**Resolution**:
- Check step logs for specific error
- Verify step configuration
- Test step independently
- Enable step retries in workflow
- Check resource availability

**Examples**:
```yaml
steps:
  - id: api-call
    uses: http-request
    with:
      url: https://api.example.com
      method: GET
    retry:  # Add retry configuration
      maxAttempts: 3
      backoff: exponential
```

---

### Exit Code: **301**
- **Name**: `DEPENDENCY_FAILED`
- **Category**: Execution Error
- **Retryable**: No

**Meaning**: A step's dependency failed, preventing it from running.

**Common Causes**:
- Previous step failed
- Circular dependency
- Missing dependency output
- Conditional dependency not met

**Resolution**:
- Review dependency chain
- Fix failing upstream steps
- Check step dependency graph
- Ensure proper step ordering

---

### Exit Code: **302**
- **Name**: `TIMEOUT`
- **Category**: Execution Error
- **Retryable**: Yes

**Meaning**: Operation exceeded configured timeout duration.

**Common Causes**:
- Network latency
- Large file processing
- Unresponsive service
- Insufficient timeout value

**Resolution**:
- Increase timeout value
- Optimize operation
- Check network connectivity
- Split into smaller operations

**Examples**:
```yaml
steps:
  - id: long-running
    uses: video-transcode
    timeout: 3600  # Increase to 1 hour
```

---

### Exit Code: **303**
- **Name**: `RESOURCE_EXHAUSTED`
- **Category**: Execution Error
- **Retryable**: Yes

**Meaning**: System ran out of required resources.

**Common Causes**:
- Out of memory
- Disk space full
- CPU quota exceeded
- Too many open files

**Resolution**:
- Free up resources
- Increase resource limits
- Optimize resource usage
- Split workload

---

### Exit Code: **304**
- **Name**: `RATE_LIMIT_EXCEEDED`
- **Category**: Execution Error
- **Retryable**: Yes (after delay)

**Meaning**: API or service rate limit was exceeded.

**Common Causes**:
- Too many requests
- Concurrent execution exceeds limit
- Quota exhausted
- Time window restriction

**Resolution**:
- Wait before retrying
- Implement exponential backoff
- Reduce request frequency
- Upgrade service tier if available

---

### Exit Code: **305**
- **Name**: `NETWORK_ERROR`
- **Category**: Execution Error
- **Retryable**: Yes

**Meaning**: Network communication failed.

**Common Causes**:
- No internet connection
- DNS resolution failed
- Server unreachable
- Firewall blocking request

**Resolution**:
- Check network connectivity
- Verify DNS settings
- Check firewall rules
- Test endpoint accessibility

---

### Exit Code: **306**
- **Name**: `EXTERNAL_SERVICE_ERROR`
- **Category**: Execution Error
- **Retryable**: Yes

**Meaning**: An external service returned an error.

**Common Causes**:
- Service temporarily down
- Service returned 5xx error
- Service maintenance
- Service overloaded

**Resolution**:
- Retry with backoff
- Check service status page
- Wait for service recovery
- Contact service support

---

### Exit Code: **307**
- **Name**: `FILESYSTEM_ERROR`
- **Category**: Execution Error
- **Retryable**: Maybe

**Meaning**: File system operation failed.

**Common Causes**:
- Disk full
- I/O error
- File system mounted read-only
- Path too long

**Resolution**:
- Check disk space: `df -h`
- Check file system errors: `dmesg`
- Remount if necessary
- Shorten file paths

---

## Security Errors (400-406)

### Exit Code: **400**
- **Name**: `INVALID_CREDENTIALS`
- **Category**: Security Error
- **Retryable**: No

**Meaning**: The provided credentials are invalid or expired.

**Common Causes**:
- Wrong password
- Expired token
- Revoked API key
- Invalid certificate

**Resolution**:
- Verify credentials are correct
- Regenerate expired credentials
- Update stored credentials
- Check credential format

**Examples**:
```bash
# Invalid master password
vaulta unlock  # Enter password
# ERROR: Invalid master password
```

---

### Exit Code: **401**
- **Name**: `AUTH_FAILED`
- **Category**: Security Error
- **Retryable**: No

**Meaning**: Authentication failed for a service or resource.

**Common Causes**:
- Not logged in
- Session expired
- Token invalid
- Auth server unreachable

**Resolution**:
- Login again: `<tool> login`
- Refresh authentication token
- Check auth service status
- Verify account status

---

### Exit Code: **402**
- **Name**: `PERMISSION_DENIED_RESOURCE`
- **Category**: Security Error
- **Retryable**: No

**Meaning**: User lacks permission to access the resource.

**Common Causes**:
- Insufficient role/permissions
- Resource access restricted
- Team membership required
- Plan/subscription limitation

**Resolution**:
- Request access from owner
- Check role assignments
- Upgrade plan if necessary
- Verify team membership

---

### Exit Code: **403**
- **Name**: `VAULT_LOCKED`
- **Category**: Security Error
- **Retryable**: Yes (after unlocking)

**Meaning**: The vault is locked and must be unlocked before use.

**Common Causes**:
- Vault auto-locked after timeout
- Vault manually locked
- Initial unlock never performed
- Session expired

**Resolution**:
- Unlock vault: `vaulta unlock`
- Enter master password
- Adjust auto-lock timeout if needed

---

### Exit Code: **404**
- **Name**: `MISSING_SECRET`
- **Category**: Security Error
- **Retryable**: No

**Meaning**: A required secret could not be found in the vault.

**Common Causes**:
- Secret path misspelled
- Secret never stored
- Secret deleted
- Wrong vault selected

**Resolution**:
- List secrets: `vaulta list`
- Verify secret path
- Store missing secret: `vaulta set <path>`
- Check vault selection

---

### Exit Code: **405**
- **Name**: `ENCRYPTION_FAILED`
- **Category**: Security Error
- **Retryable**: No

**Meaning**: Failed to encrypt data.

**Common Causes**:
- Encryption key unavailable
- Cryptography library error
- Unsupported encryption algorithm
- Data format incompatible

**Resolution**:
- Verify encryption key available
- Check crypto library installed
- Use supported algorithm
- Check system crypto support

---

### Exit Code: **406**
- **Name**: `DECRYPTION_FAILED`
- **Category**: Security Error
- **Retryable**: No

**Meaning**: Failed to decrypt data.

**Common Causes**:
- Wrong decryption key
- Data corrupted
- Incompatible encryption version
- Tampering detected

**Resolution**:
- Verify correct key used
- Check data integrity
- Restore from backup
- Re-encrypt with correct key

---

## Internal Errors (500-509)

### Exit Code: **500**
- **Name**: `INTERNAL_ERROR`
- **Category**: Internal Error
- **Retryable**: Maybe

**Meaning**: An unexpected internal error occurred.

**Common Causes**:
- Unhandled exception
- Bug in code
- Assertion failure
- Inconsistent internal state

**Resolution**:
- Report bug with full error details
- Enable debug logging: `--log-level debug`
- Try with previous version
- Check for known issues
- Collect diagnostic information

---

### Exit Code: **501**
- **Name**: `UNHANDLED_ERROR`
- **Category**: Internal Error
- **Retryable**: No

**Meaning**: An error occurred that wasn't properly caught.

**Common Causes**:
- Unexpected error type
- Missing error handler
- Panic/crash
- Runtime error

**Resolution**:
- Report as bug
- Provide reproduction steps
- Share error logs
- Check for core dump

---

### Exit Code: **502**
- **Name**: `STATE_CORRUPTION`
- **Category**: Internal Error
- **Retryable**: No

**Meaning**: Internal state or data corruption detected.

**Common Causes**:
- Interrupted write operation
- Concurrent modification
- Storage corruption
- Version incompatibility

**Resolution**:
- Restore from backup
- Re-initialize state
- Check file system integrity
- Report corruption details

---

### Exit Code: **503**
- **Name**: `PANIC`
- **Category**: Internal Error
- **Retryable**: No

**Meaning**: Unrecoverable error causing immediate termination.

**Common Causes**:
- Fatal assertion failure
- Out of memory
- Stack overflow
- Critical bug

**Resolution**:
- Report panic with backtrace
- Check system resources
- Update to latest version
- Run in safe mode if available

---

### Exit Code: **504**
- **Name**: `ASSERTION_FAILED`
- **Category**: Internal Error
- **Retryable**: No

**Meaning**: An internal invariant or assertion was violated.

**Common Causes**:
- Logic bug
- Invalid state transition
- Data inconsistency
- Contract violation

**Resolution**:
- Report as critical bug
- Provide assertion details
- Share system state
- Use stable release

---

### Exit Code: **505**
- **Name**: `NOT_IMPLEMENTED`
- **Category**: Internal Error
- **Retryable**: No

**Meaning**: Feature or operation is not yet implemented.

**Common Causes**:
- Using experimental feature
- Unsupported operation
- Platform not supported
- Deprecated functionality

**Resolution**:
- Check documentation for alternatives
- Use supported features
- Wait for feature implementation
- Consider workarounds

---

### Exit Code: **506**
- **Name**: `INVALID_STATE`
- **Category**: Internal Error
- **Retryable**: No

**Meaning**: Operation cannot proceed due to invalid state.

**Common Causes**:
- State machine error
- Incorrect operation sequence
- Concurrent modification
- Cleanup not performed

**Resolution**:
- Reset to known good state
- Follow correct operation sequence
- Avoid concurrent operations
- Perform cleanup operations

---

### Exit Code: **507**
- **Name**: `INITIALIZATION_FAILED`
- **Category**: Internal Error
- **Retryable**: Maybe

**Meaning**: Failed to initialize system or component.

**Common Causes**:
- Missing system dependencies
- Insufficient permissions
- Resource unavailable
- Configuration error

**Resolution**:
- Check system requirements
- Verify dependencies installed
- Review initialization logs
- Clear cache/temp files

---

### Exit Code: **508**
- **Name**: `SHUTDOWN_FAILED`
- **Category**: Internal Error
- **Retryable**: No

**Meaning**: Failed to cleanly shutdown system.

**Common Causes**:
- Resource cleanup failed
- Open connections/files
- Timeout during shutdown
- Signal handling error

**Resolution**:
- Force cleanup if safe
- Check for stuck processes
- Review shutdown logs
- Kill remaining processes if needed

---

### Exit Code: **509**
- **Name**: `VERSION_MISMATCH`
- **Category**: Internal Error
- **Retryable**: No

**Meaning**: Version incompatibility between components.

**Common Causes**:
- Mismatched tool versions
- Incompatible data format version
- Schema version mismatch
- Plugin version incompatible

**Resolution**:
- Update all components to compatible versions
- Migrate data format: `<tool> migrate`
- Check compatibility matrix
- Use version-specific commands

---

## Usage Examples

### Handling Exit Codes in Scripts

```bash
#!/bin/bash

orbyt run workflow.yaml
EXIT_CODE=$?

case $EXIT_CODE in
  0)
    echo "Success!"
    ;;
  3*)
    echo "Execution error - retrying..."
    sleep 5
    orbyt run workflow.yaml
    ;;
  4*)
    echo "Security error - check credentials"
    vaulta unlock
    orbyt run workflow.yaml
    ;;
  5*)
    echo "Internal error - please report"
    orbyt --log-level debug run workflow.yaml > debug.log 2>&1
    ;;
  *)
    echo "Unknown error: $EXIT_CODE"
    ;;
esac
```

### Checking Exit Code Category

```typescript
import { ExitCodes, getExitCodeCategory, isRetryable } from '@ecosystem/core';

const exitCode = process.exitCode || 0;
const category = getExitCodeCategory(exitCode);

if (isRetryable(exitCode)) {
  console.log(`Error is retryable (${category})`);
  // Implement retry logic
} else {
  console.error(`Fatal error (${category})`);
}
```

---

## Best Practices

1. **Always Check Exit Codes**: Don't ignore exit codes in scripts:
   ```bash
   orbyt run workflow.yaml || exit $?
   ```

2. **Implement Retries for Retryable Errors**: Exit codes in the 3xx range are typically retryable.

3. **Log Exit Codes**: Include exit codes in logging for debugging:
   ```bash
   orbyt run workflow.yaml
   echo "Exit code: $?" >> execution.log
   ```

4. **Handle Security Errors Separately**: 4xx errors require special attention and should never be auto-retried.

5. **Report Internal Errors**: 5xx errors indicate bugs - always report with details.

---

## See Also

- [Error Catalog](../errors/ErrorCatalog.md) - Detailed error code documentation
- [Error Handling Guide](../../internal-docs/ecosystem/ecosystem-error-handling.md) - Error handling patterns
- [Exit Codes Source](./ExitCodes.ts) - TypeScript enum definition
