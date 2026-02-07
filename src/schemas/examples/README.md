# Orbyt Workflow Examples

This directory contains example workflow definitions demonstrating various features and use cases of the Orbyt workflow schema.

## Examples

### 📄 workflow.minimal.yaml
**Purpose:** Absolute minimum valid workflow  
**Use for:** Getting started, testing validators, understanding basic structure  
**Features:**
- Only required fields
- Single step
- Simplest possible structure

### 📄 workflow.complete.yaml
**Purpose:** Comprehensive demonstration of ALL schema fields  
**Use for:** Understanding full capabilities, reference documentation  
**Features:**
- Every possible field (including future-reserved)
- Multiple step types and dependencies
- Conditional execution
- All configuration options
- Extensive comments explaining each section

### 📄 workflow.mediaproc.yaml
**Purpose:** Realistic media processing pipeline  
**Use for:** Learning practical MediaProc integration, copy-paste starting point  
**Features:**
- MediaProc plugin integration (`mediaproc.*` actions)
- Variable chaining between steps
- Vaulta secret management
- Reusable inputs
- Output mapping across steps
- Real-world image processing flow

### 📄 workflow.mixed.yaml
**Purpose:** Multi-domain workflow demonstrating universal adapter pattern  
**Use for:** Understanding Orbyt's domain-agnostic nature  
**Features:**
- CLI adapter (`cli.exec`)
- HTTP adapter (`http.request`)
- Shell adapter (`shell.run`)
- Database adapter (`db.query`)
- Plugin adapter (`plugin.*`)
- Demonstrates same schema works across any domain

## Using These Examples

### For Learning
Start with `workflow.minimal.yaml`, then move to `workflow.mediaproc.yaml` for practical patterns.

### For Reference
Use `workflow.complete.yaml` to see all available options and their usage.

### For Starting Projects
Copy `workflow.mediaproc.yaml` or `workflow.mixed.yaml` and modify for your needs.

### For Testing
All examples are valid and can be used to test:
- Schema validators
- Workflow parsers
- Execution engines
- Documentation generators

## Validation

Validate any example against the schema:

```bash
# Using JSON Schema validator
ajv validate -s ../workflow.schema.json -d workflow.minimal.yaml

# Using Orbyt CLI (when available)
orbyt validate workflow.minimal.yaml
orbyt explain workflow.mediaproc.yaml
```

## Variable Syntax

All examples use Orbyt's variable interpolation syntax:

- `${inputs.name}` - Runtime input parameters
- `${secrets.KEY}` - Secret references (from Vaulta)
- `${steps.stepId.outputs.field}` - Output from previous steps
- `${context.env}` - Runtime context
- `${env.VAR}` - Environment variables

## Secret Format

Secrets follow the pattern: `provider:path`

Examples:
- `vaulta:mediaproc/api/key`
- `vaulta:orbyt/keys/upload-token`
- `aws-secrets:prod/db/password` (future)

Never store actual secret values in workflow files!

## Action Format (`uses` field)

Actions follow the pattern: `namespace.action` or `namespace.domain.action`

Examples:
- `mediaproc.image.resize` - MediaProc plugin
- `cli.exec` - CLI adapter
- `http.request` - HTTP adapter
- `shell.run` - Shell adapter
- `db.query` - Database adapter
- `plugin.custom.action` - Custom plugin

This universal pattern makes Orbyt work across any domain.

## Contributing Examples

When adding new examples:
1. Use descriptive names: `workflow.[purpose].yaml`
2. Add comprehensive comments
3. Demonstrate specific features or patterns
4. Update this README
5. Ensure example validates against schema

## Questions?

See the schema documentation:
- `/ecosystem-core/schemas/workflow.schema.json` - Full JSON Schema
- `/ecosystem-core/schemas/workflow.schema.zod.ts` - Zod validation
- `/ecosystem-core/types/workflow.types.ts` - TypeScript types
