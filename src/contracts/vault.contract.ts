/**
 * @dev-ecosystem/core - Vault Contract
 * 
 * Defines the contract for secure secret storage and credential management.
 * Used by Vaulta and integrated across all ecosystem products.
 */

/**
 * Secret storage backend types
 */
export enum VaultBackend {
  LOCAL = 'local',
  HASHICORP = 'hashicorp',
  AWS_SECRETS_MANAGER = 'aws-secrets-manager',
  AZURE_KEY_VAULT = 'azure-key-vault',
  GCP_SECRET_MANAGER = 'gcp-secret-manager',
  CUSTOM = 'custom',
}

/**
 * Secret metadata
 */
export interface SecretMetadata {
  key: string;
  version?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  tags?: Record<string, string>;
  description?: string;
  rotationPolicy?: SecretRotationPolicy;
}

/**
 * Secret rotation policy
 */
export interface SecretRotationPolicy {
  enabled: boolean;
  interval: string; // e.g., '30d', '90d'
  notifyBeforeExpiry?: string; // e.g., '7d'
}

/**
 * Secret value with metadata
 */
export interface Secret {
  key: string;
  value: string;
  metadata: SecretMetadata;
}

/**
 * Vault interface
 */
export interface IVault {
  /**
   * Initialize the vault with configuration
   */
  initialize(config: VaultConfig): Promise<void>;
  
  /**
   * Store a secret
   */
  set(key: string, value: string, options?: SetSecretOptions): Promise<void>;
  
  /**
   * Retrieve a secret
   */
  get(key: string, version?: string): Promise<string | null>;
  
  /**
   * Check if a secret exists
   */
  has(key: string): Promise<boolean>;
  
  /**
   * Delete a secret
   */
  delete(key: string): Promise<void>;
  
  /**
   * List all secret keys
   */
  list(prefix?: string): Promise<string[]>;
  
  /**
   * Get secret metadata
   */
  getMetadata(key: string): Promise<SecretMetadata | null>;
  
  /**
   * Update secret metadata
   */
  updateMetadata(key: string, metadata: Partial<SecretMetadata>): Promise<void>;
  
  /**
   * Rotate a secret
   */
  rotate(key: string, newValue: string): Promise<void>;
  
  /**
   * Get secret versions
   */
  getVersions(key: string): Promise<string[]>;
  
  /**
   * Restore a previous version
   */
  restoreVersion(key: string, version: string): Promise<void>;
  
  /**
   * Lock the vault
   */
  lock(): Promise<void>;
  
  /**
   * Unlock the vault
   */
  unlock(credentials: VaultCredentials): Promise<void>;
  
  /**
   * Check if vault is locked
   */
  isLocked(): boolean;
  
  /**
   * Health check
   */
  healthCheck(): Promise<boolean>;
  
  /**
   * Cleanup resources
   */
  shutdown(): Promise<void>;
}

/**
 * Vault configuration
 */
export interface VaultConfig {
  backend: VaultBackend;
  storageDir?: string;
  endpoint?: string;
  credentials?: VaultCredentials;
  encryption?: VaultEncryptionConfig;
  cache?: VaultCacheConfig;
  options?: Record<string, unknown>;
}

/**
 * Vault credentials
 */
export interface VaultCredentials {
  type: 'password' | 'token' | 'certificate' | 'iam';
  password?: string;
  token?: string;
  certificate?: {
    cert: string;
    key: string;
  };
  iam?: {
    roleArn?: string;
    profile?: string;
  };
}

/**
 * Vault encryption configuration
 */
export interface VaultEncryptionConfig {
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305';
  keyDerivation: 'pbkdf2' | 'argon2' | 'scrypt';
  iterations?: number;
  saltLength?: number;
}

/**
 * Vault cache configuration
 */
export interface VaultCacheConfig {
  enabled: boolean;
  ttl?: number; // seconds
  maxSize?: number; // max cached secrets
}

/**
 * Options for setting secrets
 */
export interface SetSecretOptions {
  tags?: Record<string, string>;
  description?: string;
  expiresAt?: Date;
  rotationPolicy?: SecretRotationPolicy;
  overwrite?: boolean;
}

/**
 * Vault access log entry
 */
export interface VaultAccessLog {
  timestamp: Date;
  operation: 'read' | 'write' | 'delete' | 'rotate';
  key: string;
  user?: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Vault audit interface
 */
export interface IVaultAudit {
  log(entry: VaultAccessLog): Promise<void>;
  query(filter: VaultAuditFilter): Promise<VaultAccessLog[]>;
  export(filter: VaultAuditFilter, format: 'json' | 'csv'): Promise<string>;
}

/**
 * Vault audit filter
 */
export interface VaultAuditFilter {
  from?: Date;
  to?: Date;
  operation?: VaultAccessLog['operation'];
  key?: string;
  user?: string;
  success?: boolean;
  limit?: number;
}

/**
 * Vault backup interface
 */
export interface IVaultBackup {
  backup(destination: string): Promise<void>;
  restore(source: string): Promise<void>;
  listBackups(): Promise<VaultBackupMetadata[]>;
}

export interface VaultBackupMetadata {
  id: string;
  timestamp: Date;
  size: number;
  secretCount: number;
  location: string;
}

/**
 * Vault provider factory
 */
export interface IVaultProvider {
  create(backend: VaultBackend, config: VaultConfig): Promise<IVault>;
  supports(backend: VaultBackend): boolean;
}
