# Error Catalog

This document provides comprehensive documentation for all error codes across the ecosystem. Errors are organized by component and category for easy navigation.

## Error Code Format

All ecosystem error codes follow the pattern: `COMPONENT-CATEGORY-NUMBER`

- **COMPONENT**: The product or service (ORBYT, MEDIAPROC, VAULTA, DEVFORGE)
- **CATEGORY**: Error category (2-4 letter code)
- **NUMBER**: Three-digit sequence number (001-999)

**Example**: `ORBYT-WF-001` = Orbyt Workflow error #001

---

## Components

- [Orbyt](#orbyt-errors) - Workflow automation engine
- [MediaProc](#mediaproc-errors) - Media processing framework
- [Vaulta](#vaulta-errors) - Secret vault
- [Devforge](#devforge-errors) - Project scaffolding tool

---

# Orbyt Errors

Orbyt is the workflow execution engine that orchestrates automation tasks.

## Workflow Errors (WF)

### ORBYT-WF-001: Workflow Not Found

**Description**: The specified workflow file or definition could not be found.

**Type**: USER  
**Exit Code**: 104 (FILE_NOT_FOUND)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Workflow file doesn't exist at specified path
- Typo in workflow filename
- Incorrect working directory
- Workflow deleted or moved

**Resolution**:
1. Verify workflow file exists: `ls -la workflow.yaml`
2. Check current directory: `pwd`
3. Use absolute path if necessary
4. List available workflows: `orbyt list`

**Example**:
```bash
$ orbyt run missing-workflow.yaml
Error: ORBYT-WF-001: Workflow 'missing-workflow.yaml' not found
```

---

### ORBYT-WF-002: Workflow Validation Failed

**Description**: The workflow definition failed schema validation.

**Type**: USER  
**Exit Code**: 103 (INVALID_SCHEMA)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Missing required fields (version, kind, metadata, steps)
- Invalid field types
- Schema constraint violations
- Unknown fields (with strict validation)

**Resolution**:
1. Validate workflow: `orbyt validate workflow.yaml`
2. Check error message for specific violations
3. Review workflow schema documentation
4. Use workflow examples as templates

**Example**:
```yaml
# Invalid - missing required 'steps' field
version: "1.0"
kind: orbyt-workflow
metadata:
  name: example
# Error: ORBYT-WF-002: Missing required field 'steps'
```

---

### ORBYT-WF-003: Dependency Cycle Detected

**Description**: Circular dependency detected in workflow step dependencies.

**Type**: USER  
**Exit Code**: 103 (INVALID_SCHEMA)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- Step A depends on Step B which depends on Step A
- Complex circular dependency chains
- Self-referential dependencies

**Resolution**:
1. Review step dependency graph
2. Identify circular reference in error message
3. Restructure workflow to remove cycle
4. Use conditional execution if needed

**Example**:
```yaml
steps:
  - id: step-1
    needs: [step-2]  # Depends on step-2
  - id: step-2
    needs: [step-1]  # Depends on step-1 - CYCLE!
# Error: ORBYT-WF-003: Circular dependency: step-1 -> step-2 -> step-1
```

---

### ORBYT-WF-004: Workflow Permission Denied

**Description**: Insufficient permissions to execute this workflow.

**Type**: SECURITY  
**Exit Code**: 402 (PERMISSION_DENIED_RESOURCE)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- User lacks required permissions
- Workflow requires elevated privileges
- Team/organization membership required
- Resource access restricted

**Resolution**:
1. Check required permissions in workflow metadata
2. Request access from workflow owner
3. Verify team/org membership
4. Contact administrator for access

---

### ORBYT-WF-005: Workflow Syntax Error

**Description**: YAML/JSON syntax error in workflow file.

**Type**: USER  
**Exit Code**: 102 (INVALID_FORMAT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Invalid YAML indentation
- Unquoted special characters
- Unclosed brackets/braces
- Invalid escape sequences

**Resolution**:
1. Use YAML validator to locate syntax error
2. Check indentation (use spaces, not tabs)
3. Quote strings with special characters
4. Use IDE with YAML syntax highlighting

**Example**:
```yaml
metadata:
  name: example
  labels:
    env: production
     team: backend  # Extra space - invalid indentation!
# Error: ORBYT-WF-005: YAML syntax error at line 5
```

---

## Step Errors (STEP)

### ORBYT-STEP-001: Step Not Found

**Description**: Referenced step ID does not exist in workflow.

**Type**: USER  
**Exit Code**: 103 (INVALID_SCHEMA)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Step referenced in `needs` doesn't exist
- Typo in step ID
- Step was removed but reference remains
- Variable reference to non-existent step output

**Resolution**:
1. Check step ID spelling
2. Verify step exists in workflow
3. Review `needs` dependencies
4. Check variable references: `${steps.step-id.outputs.value}`

---

### ORBYT-STEP-002: Step Dependency Failed

**Description**: A step's dependency failed, blocking execution.

**Type**: EXECUTION  
**Exit Code**: 301 (DEPENDENCY_FAILED)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- Required previous step failed
- Dependency didn't produce expected output
- Conditional dependency not met

**Resolution**:
1. Check logs of failed dependency step
2. Fix failing step
3. Use `continueOnError: true` if failure is acceptable
4. Add conditional execution: `when: ${steps.dep.status == 'success'}`

---

### ORBYT-STEP-003: Step Condition Not Met

**Description**: Step's conditional expression evaluated to false.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: LOW  
**Retryable**: No

**When It Occurs**:
- `when` condition evaluates to false
- Input values don't match condition
- Environmental conditions not met

**Resolution**:
- This is expected behavior, not an error
- Review `when` condition if unexpected
- Check variable values used in condition
- Verify condition logic is correct

---

### ORBYT-STEP-004: Step Retry Exhausted

**Description**: Step failed and exhausted all retry attempts.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: HIGH  
**Retryable**: No (already retried)

**When It Occurs**:
- Step consistently fails
- Maximum retry attempts reached
- Backoff delay completed but still failing

**Resolution**:
1. Check step error in logs
2. Increase `maxAttempts` if transient issue
3. Fix underlying cause of failure
4. Adjust backoff strategy if timing-related

**Example**:
```yaml
steps:
  - id: api-call
    uses: http-request
    retry:
      maxAttempts: 3  # Already tried 3 times
      backoff: exponential
# Error: ORBYT-STEP-004: Step 'api-call' failed after 3 attempts
```

---

### ORBYT-STEP-005: Step Timeout

**Description**: Step execution exceeded configured timeout.

**Type**: EXECUTION  
**Exit Code**: 302 (TIMEOUT)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Long-running operation
- Network delays
- Resource contention
- Insufficient timeout value

**Resolution**:
1. Increase step timeout value
2. Optimize step operation
3. Split into multiple steps
4. Check for hanging processes

**Example**:
```yaml
steps:
  - id: slow-step
    uses: long-operation
    timeout: 300  # 5 minutes - increase if needed
```

---

## Adapter Errors (ADAPTER)

### ORBYT-ADAPTER-001: Adapter Not Found

**Description**: The specified adapter could not be found or loaded.

**Type**: CONFIG  
**Exit Code**: 202 (MISSING_DEPENDENCY)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- Adapter not installed
- Typo in adapter name
- Adapter removed or renamed
- Plugin repository unavailable

**Resolution**:
1. Install adapter: `orbyt adapter install <name>`
2. Verify adapter name: `orbyt adapter list`
3. Check adapter is in registry
4. Update to correct adapter name

**Example**:
```yaml
steps:
  - id: example
    uses: non-existent-adapter  # Not installed
    # Error: ORBYT-ADAPTER-001: Adapter 'non-existent-adapter' not found
```

---

### ORBYT-ADAPTER-002: Adapter Execution Failed

**Description**: Adapter execution failed with an error.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: HIGH  
**Retryable**: Yes

**When It Occurs**:
- Adapter internal error
- Invalid adapter inputs
- External service failure
- Resource unavailable

**Resolution**:
1. Check adapter-specific error in logs
2. Verify adapter inputs are correct
3. Test adapter independently
4. Check adapter documentation
5. Report issue to adapter author if bug

---

### ORBYT-ADAPTER-003: Adapter Configuration Invalid

**Description**: Adapter configuration is invalid or incomplete.

**Type**: CONFIG  
**Exit Code**: 201 (INVALID_CONFIG)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Missing required adapter parameters
- Invalid parameter types
- Mutually exclusive options
- Out-of-range values

**Resolution**:
1. Review adapter documentation
2. Check required vs optional parameters
3. Validate parameter types and values
4. Use adapter examples as reference

**Example**:
```yaml
steps:
  - id: example
    uses: http-request
    with:
      # Missing required 'url' parameter
      method: GET
# Error: ORBYT-ADAPTER-003: Missing required parameter 'url'
```

---

### ORBYT-ADAPTER-004: Adapter Timeout

**Description**: Adapter execution exceeded timeout.

**Type**: EXECUTION  
**Exit Code**: 302 (TIMEOUT)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Adapter operation too slow
- Network delays
- External service slow
- Insufficient timeout

**Resolution**:
1. Increase adapter timeout
2. Optimize adapter operation
3. Check external service performance
4. Use async execution if available

---

## Engine Errors (ENGINE)

### ORBYT-ENGINE-001: Workflow Engine Error

**Description**: Internal workflow engine error.

**Type**: INTERNAL  
**Exit Code**: 500 (INTERNAL_ERROR)  
**Severity**: CRITICAL  
**Retryable**: Maybe

**When It Occurs**:
- Engine bug
- Unexpected state
- Resource corruption
- System error

**Resolution**:
1. Report as bug with full logs
2. Enable debug logging
3. Try with previous version
4. Check for known issues

---

### ORBYT-ENGINE-002: Execution Timeout

**Description**: Entire workflow execution exceeded global timeout.

**Type**: EXECUTION  
**Exit Code**: 302 (TIMEOUT)  
**Severity**: HIGH  
**Retryable**: Yes

**When It Occurs**:
- Workflow too long-running
- Multiple step timeouts
- Infinite loop
- Resource starvation

**Resolution**:
1. Increase workflow timeout
2. Optimize slow steps
3. Check for infinite loops
4. Split into multiple workflows

---

### ORBYT-ENGINE-003: Concurrency Limit Reached

**Description**: Maximum concurrent workflow executions reached.

**Type**: CONFIG  
**Exit Code**: 303 (RESOURCE_EXHAUSTED)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Too many simultaneous workflows
- Concurrency limit configured too low
- Resource exhaustion
- Queue backlog

**Resolution**:
1. Wait for workflows to complete
2. Increase concurrency limit
3. Stagger workflow starts
4. Use queue system

---

## Variable Resolution Errors (VAR)

### ORBYT-VAR-001: Variable Not Found

**Description**: Referenced variable does not exist in context.

**Type**: USER  
**Exit Code**: 103 (INVALID_SCHEMA)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Typo in variable name
- Variable not defined in workflow
- Step output doesn't exist
- Environment variable not set

**Resolution**:
1. Check variable name spelling
2. Verify variable is defined
3. Check step output name
4. Set environment variable: `export VAR=value`

**Example**:
```yaml
steps:
  - id: example
    with:
      value: ${inputs.non_existent}  # Not in inputs
# Error: ORBYT-VAR-001: Variable 'inputs.non_existent' not found
```

---

### ORBYT-VAR-002: Variable Resolution Failed

**Description**: Failed to resolve variable reference.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Circular variable reference
- Complex expression error
- Type conversion failure
- Null/undefined value

**Resolution**:
1. Simplify variable expression
2. Check for circular references
3. Ensure variable has value
4. Add default values

---

### ORBYT-VAR-003: Invalid Variable Reference

**Description**: Variable reference syntax is invalid.

**Type**: USER  
**Exit Code**: 103 (INVALID_SCHEMA)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Malformed `${}` syntax
- Invalid namespace
- Invalid path separator
- Unclosed brace

**Resolution**:
1. Fix variable syntax: `${namespace.path}`
2. Use valid namespaces: inputs, secrets, steps, context, env
3. Check for typos in syntax

**Example**:
```yaml
with:
  value: ${invalid}  # Missing namespace
  value2: $steps.out  # Missing braces
  value3: ${steps..output}  # Double dot
# Error: ORBYT-VAR-003: Invalid variable syntax
```

---

## Secret Errors (SEC)

### ORBYT-SEC-001: Secret Resolution Failed

**Description**: Failed to resolve secret reference from vault.

**Type**: SECURITY  
**Exit Code**: 404 (MISSING_SECRET)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- Secret path invalid
- Vault connection failed
- Permission denied
- Secret deleted

**Resolution**:
1. Verify secret exists: `vaulta get <path>`
2. Check secret path spelling
3. Ensure vault is unlocked
4. Verify read permissions

---

### ORBYT-SEC-002: Secret Not Found in Vault

**Description**: The specified secret does not exist in the vault.

**Type**: SECURITY  
**Exit Code**: 404 (MISSING_SECRET)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- Secret never stored
- Secret path misspelled
- Secret deleted
- Wrong vault

**Resolution**:
1. List secrets: `vaulta list`
2. Store secret: `vaulta set <path> <value>`
3. Check secret path exactly matches reference
4. Verify correct vault selected

**Example**:
```yaml
secrets:
  api_key: vaulta:api/production/key  # Must exist in vault

steps:
  - id: api-call
    with:
      api_key: ${secrets.api_key}
# Error: ORBYT-SEC-002: Secret 'api/production/key' not found in vault
```

---

###ORBYT-SEC-003: Vault Connection Failed

**Description**: Failed to connect to the vault service.

**Type**: EXECUTION  
**Exit Code**: 305 (NETWORK_ERROR)  
**Severity**: CRITICAL  
**Retryable**: Yes

**When It Occurs**:
- Vault service down
- Network connectivity issue
- Vault not initialized
- Wrong vault address

**Resolution**:
1. Check vault service status
2. Verify network connectivity
3. Initialize vault: `vaulta init`
4. Check vault configuration

---

# MediaProc Errors

MediaProc is the media processing framework for images, videos, and audio.

## Image Errors (IMG)

### MEDIAPROC-IMG-001: Image Format Unsupported

**Description**: The image format is not supported.

**Type**: USER  
**Exit Code**: 102 (INVALID_FORMAT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Rare/proprietary image format
- RAW camera format not supported
- Corrupted format identifier

**Resolution**:
1. Convert to supported format (JPEG, PNG, WebP, GIF)
2. Install additional codec support
3. Check format support: `mediaproc formats --type image`

**Supported Formats**: JPEG, PNG, WebP, GIF, BMP, TIFF, SVG

---

### MEDIAPROC-IMG-002: Image Resize Failed

**Description**: Failed to resize image.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Invalid dimensions (0, negative, too large)
- Memory exhausted
- Corrupted image data
- Processing library error

**Resolution**:
1. Check dimensions are valid and reasonable
2. Ensure sufficient memory
3. Verify image is not corrupted
4. Try different resize algorithm

---

### MEDIAPROC-IMG-003: Image Conversion Failed

**Description**: Failed to convert image to target format.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Source format corrupted
- Target format not writable
- Color space conversion issue
- Compression error

**Resolution**:
1. Verify source image is valid
2. Check target format is supported for writing
3. Try intermediate format conversion
4. Adjust quality/compression settings

---

### MEDIAPROC-IMG-004: Image File Corrupted

**Description**: The image file is corrupted or truncated.

**Type**: USER  
**Exit Code**: 101 (INVALID_FILE)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- Incomplete download
- File transfer error
- Storage corruption
- Invalid file structure

**Resolution**:
1. Re-download or re-upload image
2. Check file integrity (checksums)
3. Try image repair tools
4. Use backup if available

---

### MEDIAPROC-IMG-005: Image Watermark Failed

**Description**: Failed to apply watermark to image.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Watermark image not found
- Invalid watermark position
- Size mismatch
- Transparency issue

**Resolution**:
1. Verify watermark file exists
2. Check position coordinates
3. Ensure watermark size < image size
4. Verify watermark format supports transparency

---

## Video Errors (VID)

### MEDIAPROC-VID-001: Video Codec Not Found

**Description**: Required video codec is not available.

**Type**: CONFIG  
**Exit Code**: 202 (MISSING_DEPENDENCY)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- FFmpeg not installed
- Codec not compiled in FFmpeg
- Missing codec library
- Proprietary codec license required

**Resolution**:
1. Install FFmpeg: `sudo apt install ffmpeg`
2. Install codec library
3. Use alternative codec
4. Check codec support: `ffmpeg -codecs`

---

### MEDIAPROC-VID-002: Video Transcode Failed

**Description**: Video transcoding operation failed.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Corrupted source video
- Insufficient disk space
- Memory exhausted
- Codec error

**Resolution**:
1. Verify source video plays correctly
2. Check available disk space
3. Ensure sufficient memory
4. Try different codec/settings
5. Enable hardware acceleration if available

---

### MEDIAPROC-VID-003: Video Format Unsupported

**Description**: The video format/container is not supported.

**Type**: USER  
**Exit Code**: 102 (INVALID_FORMAT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Rare/proprietary video format
- Corrupted format header
- Incomplete format support

**Resolution**:
1. Convert to supported format (MP4, MKV, WebM)
2. Update FFmpeg to latest version
3. Check format support: `mediaproc formats --type video`

**Supported Formats**: MP4, MKV, WebM, AVI, MOV, FLV

---

### MEDIAPROC-VID-004: Video File Corrupted

**Description**: The video file is corrupted or damaged.

**Type**: USER  
**Exit Code**: 101 (INVALID_FILE)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- Incomplete download
- Recording interrupted
- Storage corruption
- Invalid keyframes

**Resolution**:
1. Re-download or re-record video
2. Try video repair: `ffmpeg -i input.mp4 -c copy repaired.mp4`
3. Extract audio and video separately
4. Use backup if available

---

## Audio Errors (AUD)

### MEDIAPROC-AUD-001: Audio Codec Not Found

**Description**: Required audio codec is not available.

**Type**: CONFIG  
**Exit Code**: 202 (MISSING_DEPENDENCY)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- Missing codec library
- FFmpeg without audio support
- Proprietary codec license

**Resolution**:
1. Install audio codec libraries
2. Reinstall FFmpeg with audio support
3. Use alternative codec
4. Check audio codec support: `ffmpeg -codecs | grep audio`

---

### MEDIAPROC-AUD-002: Audio Conversion Failed

**Description**: Audio format conversion failed.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Corrupted audio data
- Unsupported sample rate
- Channel configuration error
- Bitrate too low/high

**Resolution**:
1. Verify source audio is valid
2. Check sample rate compatibility
3. Adjust bitrate settings
4. Try intermediate format

---

### MEDIAPROC-AUD-003: Audio Format Unsupported

**Description**: The audio format is not supported.

**Type**: USER  
**Exit Code**: 102 (INVALID_FORMAT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Proprietary audio format
- Rare codec
- DRM-protected audio

**Resolution**:
1. Convert to supported format (MP3, AAC, FLAC, OGG)
2. Update codec libraries
3. Check format support: `mediaproc formats --type audio`

**Supported Formats**: MP3, AAC, FLAC, OGG, WAV, OPUS

---

## Pipeline Errors (PIPE)

### MEDIAPROC-PIPE-001: Pipeline Step Failed

**Description**: A processing pipeline step failed.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: HIGH  
**Retryable**: Yes

**When It Occurs**:
- Step operation failed
- Invalid step configuration
- Resource unavailable
- Previous step output incompatible

**Resolution**:
1. Check specific step error
2. Verify step configuration
3. Test step independently
4. Check input from previous step

---

### MEDIAPROC-PIPE-002: Pipeline Configuration Invalid

**Description**: Pipeline configuration is invalid.

**Type**: CONFIG  
**Exit Code**: 201 (INVALID_CONFIG)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Missing required steps
- Incompatible step sequence
- Invalid parameters
- Circular pipeline

**Resolution**:
1. Validate pipeline configuration
2. Check step compatibility
3. Review required vs optional steps
4. Use pipeline examples

---

### MEDIAPROC-PIPE-003: Pipeline Timeout

**Description**: Pipeline execution exceeded timeout.

**Type**: EXECUTION  
**Exit Code**: 302 (TIMEOUT)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Large file processing
- Complex pipeline
- Multiple processing steps
- Resource contention

**Resolution**:
1. Increase pipeline timeout
2. Optimize pipeline steps
3. Split into smaller pipelines
4. Use parallel processing

---

# Vaulta Errors

Vaulta is the secret vault for secure storage of sensitive data.

## Vault Lifecycle Errors (VAULT)

### VAULTA-VAULT-001: Vault Not Initialized

**Description**: Vault has not been initialized yet.

**Type**: CONFIG  
**Exit Code**: 200 (MISSING_CONFIG)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- First time using Vaulta
- Vault directory deleted
- Running in wrong directory

**Resolution**:
1. Initialize vault: `vaulta init`
2. Follow initialization prompts
3. Set master password
4. Backup recovery keys

---

### VAULTA-VAULT-002: Vault Locked

**Description**: Vault is locked and must be unlocked.

**Type**: SECURITY  
**Exit Code**: 403 (VAULT_LOCKED)  
**Severity**: HIGH  
**Retryable**: Yes (after unlocking)

**When It Occurs**:
- Vault auto-locked after timeout
- Vault manually locked
- New session started
- Master password not entered

**Resolution**:
1. Unlock vault: `vaulta unlock`
2. Enter master password
3. Adjust auto-lock timeout if needed: `vaulta config set autoLockTimeout 3600`

---

### VAULTA-VAULT-003: Vault Already Exists

**Description**: A vault already exists at this location.

**Type**: USER  
**Exit Code**: 100 (INVALID_INPUT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Trying to initialize where vault exists
- Multiple initialization attempts

**Resolution**:
1. Use existing vault: `vaulta unlock`
2. Delete old vault if starting fresh: `vaulta destroy`
3. Use different directory for new vault

---

### VAULTA-VAULT-004: Vault Not Found

**Description**: No vault found at the specified location.

**Type**: USER  
**Exit Code**: 100 (INVALID_INPUT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Wrong directory
- Vault deleted
- Path misconfigured

**Resolution**:
1. Navigate to vault directory
2. Check vault path configuration
3. Initialize new vault if needed
4. Restore from backup

---

### VAULTA-VAULT-005: Vault Corrupted

**Description**: Vault data is corrupted and cannot be read.

**Type**: INTERNAL  
**Exit Code**: 502 (STATE_CORRUPTION)  
**Severity**: CRITICAL  
**Retryable**: No

**When It Occurs**:
- Data corruption
- Interrupted write operation
- File system error
- Encryption corruption

**Resolution**:
1. Restore from backup immediately
2. Check file system integrity
3. Report corruption details
4. DO NOT attempt to unlock corrupted vault

---

## Security Errors (SEC)

### VAULTA-SEC-001: Invalid Master Password

**Description**: The provided master password is incorrect.

**Type**: SECURITY  
**Exit Code**: 400 (INVALID_CREDENTIALS)  
**Severity**: HIGH  
**Retryable**: Yes (with correct password)

**When It Occurs**:
- Wrong password entered
- Typo in password
- Caps Lock on
- Password changed elsewhere

**Resolution**:
1. Re-enter password carefully
2. Check Caps Lock
3. Use password recovery if available
4. Restore from backup if password lost

---

### VAULTA-SEC-002: Permission Denied

**Description**: Insufficient permissions to access vault.

**Type**: SECURITY  
**Exit Code**: 105 (PERMISSION_DENIED)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- File permission denied
- Different user created vault
- SELinux/AppArmor restriction

**Resolution**:
1. Check file permissions: `ls -la ~/.vaulta`
2. Change ownership if needed (carefully!)
3. Run with appropriate user
4. Check security policies

---

### VAULTA-SEC-003: Authentication Failed

**Description**: Authentication with vault service failed.

**Type**: SECURITY  
**Exit Code**: 401 (AUTH_FAILED)  
**Severity**: HIGH  
**Retryable**: Yes

**When It Occurs**:
- Invalid credentials
- Session expired
- Token revoked

**Resolution**:
1. Re-authenticate: `vaulta login`
2. Refresh credentials
3. Check credential expiry

---

### VAULTA-SEC-004: Session Expired

**Description**: Vault session has expired.

**Type**: SECURITY  
**Exit Code**: 401 (AUTH_FAILED)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Session timeout reached
- Inactivity timeout
- Max session duration exceeded

**Resolution**:
1. Unlock vault again: `vaulta unlock`
2. Adjust session timeout if too short

---

## Cryptography Errors (CRYPTO)

### VAULTA-CRYPTO-001: Encryption Failed

**Description**: Failed to encrypt data.

**Type**: INTERNAL  
**Exit Code**: 405 (ENCRYPTION_FAILED)  
**Severity**: CRITICAL  
**Retryable**: No

**When It Occurs**:
- Cryptography library error
- Key generation failed
- Algorithm not supported
- System error

**Resolution**:
1. Report as critical bug
2. Check crypto library installation
3. Verify system crypto support
4. Check system entropy: `cat /proc/sys/kernel/random/entropy_avail`

---

### VAULTA-CRYPTO-002: Decryption Failed

**Description**: Failed to decrypt data.

**Type**: SECURITY  
**Exit Code**: 406 (DECRYPTION_FAILED)  
**Severity**: CRITICAL  
**Retryable**: No

**When It Occurs**:
- Wrong decryption key
- Data corrupted
- Data tampered
- Version incompatibility

**Resolution**:
1. Verify correct master password
2. Check data integrity
3. Restore from backup
4. DO NOT retry - may be tampering

---

### VAULTA-CRYPTO-003: Invalid Encryption Key

**Description**: The encryption key is invalid or corrupted.

**Type**: SECURITY  
**Exit Code**: 400 (INVALID_CREDENTIALS)  
**Severity**: CRITICAL  
**Retryable**: No

**When It Occurs**:
- Key file corrupted
- Key derivation failed
- Wrong key provided

**Resolution**:
1. Verify key file integrity
2. Restore key from backup
3. Re-derive key from master password
4. Contact support if persistent

---

## Access Control Errors (ACCESS)

### VAULTA-ACCESS-001: Secret Not Found

**Description**: The requested secret does not exist.

**Type**: USER  
**Exit Code**: 404 (MISSING_SECRET)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Secret path misspelled
- Secret never stored
- Secret deleted
- Wrong vault

**Resolution**:
1. List secrets: `vaulta list`
2. Check secret path spelling
3. Store secret: `vaulta set <path> <value>`

---

### VAULTA-ACCESS-002: Secret Already Exists

**Description**: A secret already exists at this path.

**Type**: USER  
**Exit Code**: 100 (INVALID_INPUT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Attempting to create existing secret
- Duplicate key

**Resolution**:
1. Update existing secret: `vaulta set <path> <new-value>`
2. Delete first: `vaulta delete <path>`
3. Use different path

---

### VAULTA-ACCESS-003: Invalid Secret Path

**Description**: The secret path format is invalid.

**Type**: USER  
**Exit Code**: 100 (INVALID_INPUT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Invalid characters in path
- Path too long
- Reserved path name
- Invalid path separator

**Resolution**:
1. Use valid path format: `category/subcategory/name`
2. Avoid special characters
3. Keep path under 256 characters
4. Don't use reserved names

**Valid Path Format**:
- Use forward slashes: `api/production/key`
- Alphanumeric plus: `-`, `_`, `/`
- No leading/trailing slashes
- No double slashes

---

### VAULTA-ACCESS-004: Secret Read Failed

**Description**: Failed to read secret from vault.

**Type**: EXECUTION  
**Exit Code**: 500 (INTERNAL_ERROR)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- I/O error
- Vault service error
- Temporary failure

**Resolution**:
1. Retry operation
2. Check vault service status
3. Verify file system health
4. Report if persistent

---

### VAULTA-ACCESS-005: Secret Write Failed

**Description**: Failed to write secret to vault.

**Type**: EXECUTION  
**Exit Code**: 500 (INTERNAL_ERROR)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Disk full
- Permission denied
- I/O error
- Vault locked

**Resolution**:
1. Check disk space: `df -h`
2. Verify write permissions
3. Ensure vault is unlocked
4. Retry operation

---

# Devforge Errors

Devforge is the project scaffolding and code generation tool.

## Template Errors (TPL)

### DEVFORGE-TPL-001: Template Not Found

**Description**: The specified template could not be found.

**Type**: USER  
**Exit Code**: 100 (INVALID_INPUT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Template name misspelled
- Template not installed
- Template deleted
- Wrong template registry

**Resolution**:
1. List templates: `devforge template list`
2. Search templates: `devforge template search <query>`
3. Install template: `devforge template install <name>`
4. Check template registry configured

---

### DEVFORGE-TPL-002: Template Parse Failed

**Description**: Failed to parse template definition.

**Type**: INTERNAL  
**Exit Code**: 500 (INTERNAL_ERROR)  
**Severity**: HIGH  
**Retryable**: No

**When It Occurs**:
- Template syntax error
- Corrupted template file
- Invalid template structure
- Parser bug

**Resolution**:
1. Update template to latest version
2. Report template issue to author
3. Use alternative template
4. Check template file integrity

---

### DEVFORGE-TPL-003: Template Structure Invalid

**Description**: Template structure doesn't meet requirements.

**Type**: USER  
**Exit Code**: 103 (INVALID_SCHEMA)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Missing required files
- Invalid template manifest
- Incorrect directory structure

**Resolution**:
1. Validate template: `devforge template validate`
2. Review template documentation
3. Fix template structure
4. Contact template author

---

### DEVFORGE-TPL-004: Template Render Failed

**Description**: Failed to render template files.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Variable missing
- Template syntax error
- Circular reference
- Conditional error

**Resolution**:
1. Provide all required variables
2. Check template syntax
3. Review rendering errors
4. Test with minimal variables

---

## Feature Errors (FEAT)

### DEVFORGE-FEAT-001: Feature Conflict

**Description**: Feature conflicts with existing feature.

**Type**: USER  
**Exit Code**: 100 (INVALID_INPUT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Mutually exclusive features
- Overlapping file modifications
- Configuration conflicts

**Resolution**:
1. Choose one feature over the other
2. Check feature compatibility
3. Install features in correct order
4. Resolve conflicts manually

---

### DEVFORGE-FEAT-002: Feature Not Found

**Description**: The specified feature does not exist.

**Type**: USER  
**Exit Code**: 100 (INVALID_INPUT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Feature name misspelled
- Feature not available in template
- Feature removed

**Resolution**:
1. List available features: `devforge feature list`
2. Check feature name spelling
3. Verify template supports feature

---

### DEVFORGE-FEAT-003: Feature Incompatible

**Description**: Feature is incompatible with current setup.

**Type**: USER  
**Exit Code**: 100 (INVALID_INPUT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Version incompatibility
- Platform not supported
- Dependencies conflict
- Configuration incompatible

**Resolution**:
1. Check compatibility requirements
2. Update to compatible versions
3. Use alternative feature
4. Adjust configuration

---

### DEVFORGE-FEAT-004: Feature Install Failed

**Description**: Failed to install feature.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: HIGH  
**Retryable**: Yes

**When It Occurs**:
- File write error
- Dependency install failed
- Network error
- Disk space issue

**Resolution**:
1. Check error details in logs
2. Verify disk space available
3. Ensure write permissions
4. Retry installation

---

## Generation Errors (GEN)

### DEVFORGE-GEN-001: Project Generation Failed

**Description**: Failed to generate project from template.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: HIGH  
**Retryable**: Yes

**When It Occurs**:
- Template rendering failed
- File write error
- Missing variables
- Script execution failed

**Resolution**:
1. Check generation logs
2. Provide all required inputs
3. Verify write permissions
4. Check disk space

---

### DEVFORGE-GEN-002: Project Already Exists

**Description**: A project already exists at the target location.

**Type**: USER  
**Exit Code**: 100 (INVALID_INPUT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Directory not empty
- Project previously generated
- Name conflict

**Resolution**:
1. Use different project name/path
2. Delete existing project if ok
3. Use `--force` flag to overwrite (careful!)

---

### DEVFORGE-GEN-003: File Generation Failed

**Description**: Failed to generate specific file.

**Type**: EXECUTION  
**Exit Code**: 307 (FILESYSTEM_ERROR)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Permission denied
- Invalid filename
- Disk full
- Path too long

**Resolution**:
1. Check file permissions
2. Verify filename is valid
3. Check disk space
4. Shorten file path

---

### DEVFORGE-GEN-004: Directory Creation Failed

**Description**: Failed to create project directory.

**Type**: EXECUTION  
**Exit Code**: 307 (FILESYSTEM_ERROR)  
**Severity**: MEDIUM  
**Retryable**: Yes

**When It Occurs**:
- Permission denied
- Parent directory doesn't exist
- Disk full
- Invalid directory name

**Resolution**:
1. Check parent directory exists
2. Verify write permissions
3. Check disk space
4. Use valid directory name

---

### DEVFORGE-GEN-005: Dependency Install Failed

**Description**: Failed to install project dependencies.

**Type**: EXECUTION  
**Exit Code**: 300 (STEP_FAILED)  
**Severity**: HIGH  
**Retryable**: Yes

**When It Occurs**:
- Network error
- Package not found
- Version conflict
- Registry unavailable

**Resolution**:
1. Check network connectivity
2. Verify package names/versions
3. Clear package cache
4. Retry installation
5. Install manually if needed

---

## Configuration Errors (CONFIG)

### DEVFORGE-CONFIG-001: Configuration Invalid

**Description**: Devforge configuration is invalid.

**Type**: CONFIG  
**Exit Code**: 201 (INVALID_CONFIG)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- Invalid config values
- Missing required settings
- Schema validation failed

**Resolution**:
1. Validate config: `devforge config validate`
2. Fix reported issues
3. Reset to defaults: `devforge config reset`

---

### DEVFORGE-CONFIG-002: Configuration Not Found

**Description**: Configuration file not found.

**Type**: CONFIG  
**Exit Code**: 200 (MISSING_CONFIG)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- First time use
- Config file deleted
- Wrong directory

**Resolution**:
1. Initialize config: `devforge init`
2. Generate default config: `devforge config generate`

---

### DEVFORGE-CONFIG-003: Configuration Parse Failed

**Description**: Failed to parse configuration file.

**Type**: CONFIG  
**Exit Code**: 102 (INVALID_FORMAT)  
**Severity**: MEDIUM  
**Retryable**: No

**When It Occurs**:
- YAML/JSON syntax error
- Corrupted config file
- Invalid encoding

**Resolution**:
1. Check config syntax
2. Validate YAML/JSON
3. Restore from backup
4. Regenerate config

---

## See Also

- [Exit Reasons](../exit-codes/ExitReasons.md) - Exit code documentation
- [Error Handling Guide](../../internal-docs/ecosystem/ecosystem-error-handling.md) - Error handling patterns
- [Error Types Source](./ErrorTypes.ts) - TypeScript error type definitions
- [Error Codes Source](./ErrorCodes.ts) - TypeScript error code definitions
