/**
 * Vaulta Error Codes
 * 
 * Structured error codes for the Vaulta secret vault.
 * 
 * Pattern: VAULTA-<CATEGORY>-<NUMBER>
 * 
 * Categories:
 * - VAULT: Vault lifecycle and management
 * - SEC: Security and authentication
 * - CRYPTO: Cryptography and encryption
 * - ACCESS: Access control and permissions
 * 
 * @category Vaulta
 * @public
 */

export const VaultaErrorCodes = {
  // =========================================================================
  // VAULT - Vault lifecycle errors
  // =========================================================================
  
  /** Vault not initialized */
  VAULT_NOT_INITIALIZED: 'VAULTA-VAULT-001',
  
  /** Vault is locked */
  VAULT_LOCKED: 'VAULTA-VAULT-002',
  
  /** Vault already exists */
  VAULT_ALREADY_EXISTS: 'VAULTA-VAULT-003',
  
  /** Vault not found */
  VAULT_NOT_FOUND: 'VAULTA-VAULT-004',
  
  /** Vault corrupted */
  VAULT_CORRUPTED: 'VAULTA-VAULT-005',
  
  /** Vault unlock failed */
  VAULT_UNLOCK_FAILED: 'VAULTA-VAULT-006',
  
  /** Vault initialization failed */
  VAULT_INIT_FAILED: 'VAULTA-VAULT-007',

  // =========================================================================
  // SECURITY (SEC) - Security and authentication
  // =========================================================================
  
  /** Invalid master password */
  INVALID_MASTER_PASSWORD: 'VAULTA-SEC-001',
  
  /** Permission denied */
  PERMISSION_DENIED: 'VAULTA-SEC-002',
  
  /** Authentication failed */
  AUTH_FAILED: 'VAULTA-SEC-003',
  
  /** Invalid credentials */
  INVALID_CREDENTIALS: 'VAULTA-SEC-004',
  
  /** Session expired */
  SESSION_EXPIRED: 'VAULTA-SEC-005',
  
  /** Password policy violation */
  PASSWORD_POLICY_VIOLATION: 'VAULTA-SEC-006',
  
  /** Too many failed attempts */
  TOO_MANY_FAILED_ATTEMPTS: 'VAULTA-SEC-007',

  // =========================================================================
  // CRYPTO (CRYPTO) - Cryptography errors
  // =========================================================================
  
  /** Encryption failed */
  ENCRYPTION_FAILED: 'VAULTA-CRYPTO-001',
  
  /** Decryption failed */
  DECRYPTION_FAILED: 'VAULTA-CRYPTO-002',
  
  /** Invalid encryption key */
  INVALID_ENCRYPTION_KEY: 'VAULTA-CRYPTO-003',
  
  /** Key derivation failed */
  KEY_DERIVATION_FAILED: 'VAULTA-CRYPTO-004',
  
  /** Cryptographic operation failed */
  CRYPTO_OPERATION_FAILED: 'VAULTA-CRYPTO-005',

  // =========================================================================
  // ACCESS (ACCESS) - Access control
  // =========================================================================
  
  /** Secret not found */
  SECRET_NOT_FOUND: 'VAULTA-ACCESS-001',
  
  /** Secret already exists */
  SECRET_ALREADY_EXISTS: 'VAULTA-ACCESS-002',
  
  /** Invalid secret path */
  INVALID_SECRET_PATH: 'VAULTA-ACCESS-003',
  
  /** Secret read failed */
  SECRET_READ_FAILED: 'VAULTA-ACCESS-004',
  
  /** Secret write failed */
  SECRET_WRITE_FAILED: 'VAULTA-ACCESS-005',
  
  /** Secret delete failed */
  SECRET_DELETE_FAILED: 'VAULTA-ACCESS-006',

} as const;

/**
 * Type for Vaulta error codes
 */
export type VaultaErrorCode = typeof VaultaErrorCodes[keyof typeof VaultaErrorCodes];

/**
 * Get category from Vaulta error code
 */
export function getVaultaErrorCategory(code: VaultaErrorCode): string {
  const match = code.match(/^VAULTA-([A-Z]+)-\d+$/);
  return match?.[1] ?? 'UNKNOWN';
}

/**
 * Check if code is a Vaulta error code
 */
export function isVaultaErrorCode(code: string): code is VaultaErrorCode {
  return Object.values(VaultaErrorCodes).includes(code as VaultaErrorCode);
}
