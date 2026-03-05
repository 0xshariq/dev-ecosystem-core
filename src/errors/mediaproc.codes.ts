/**
 * MediaProc Error Codes
 * 
 * Structured error codes for the MediaProc media processing framework.
 * 
 * Pattern: MEDIAPROC-<CATEGORY>-<NUMBER>
 * 
 * Categories:
 * - IMG: Image processing errors
 * - VID: Video processing errors
 * - AUD: Audio processing errors
 * - PIPE: Pipeline execution errors
 * - CODEC: Codec and format errors
 * 
 * @category MediaProc
 * @public
 */

export const MediaProcErrorCodes = {
  // =========================================================================
  // IMAGE (IMG) - Image processing errors
  // =========================================================================
  
  /** Unsupported image format */
  IMAGE_FORMAT_UNSUPPORTED: 'MEDIAPROC-IMG-001',
  
  /** Image resize operation failed */
  IMAGE_RESIZE_FAILED: 'MEDIAPROC-IMG-002',
  
  /** Image conversion failed */
  IMAGE_CONVERSION_FAILED: 'MEDIAPROC-IMG-003',
  
  /** Invalid image dimensions */
  IMAGE_DIMENSIONS_INVALID: 'MEDIAPROC-IMG-004',
  
  /** Image file corrupted */
  IMAGE_FILE_CORRUPTED: 'MEDIAPROC-IMG-005',
  
  /** Image watermark failed */
  IMAGE_WATERMARK_FAILED: 'MEDIAPROC-IMG-006',
  
  /** Image optimization failed */
  IMAGE_OPTIMIZATION_FAILED: 'MEDIAPROC-IMG-007',
  
  /** Image metadata extraction failed */
  IMAGE_METADATA_FAILED: 'MEDIAPROC-IMG-008',

  // =========================================================================
  // VIDEO (VID) - Video processing errors
  // =========================================================================
  
  /** Video codec not found */
  VIDEO_CODEC_NOT_FOUND: 'MEDIAPROC-VID-001',
  
  /** Video transcode failed */
  VIDEO_TRANSCODE_FAILED: 'MEDIAPROC-VID-002',
  
  /** Unsupported video format */
  VIDEO_FORMAT_UNSUPPORTED: 'MEDIAPROC-VID-003',
  
  /** Video file corrupted */
  VIDEO_FILE_CORRUPTED: 'MEDIAPROC-VID-004',
  
  /** Video encoding failed */
  VIDEO_ENCODING_FAILED: 'MEDIAPROC-VID-005',
  
  /** Video decoding failed */
  VIDEO_DECODING_FAILED: 'MEDIAPROC-VID-006',
  
  /** Invalid video bitrate */
  VIDEO_BITRATE_INVALID: 'MEDIAPROC-VID-007',
  
  /** Video frame extraction failed */
  VIDEO_FRAME_EXTRACTION_FAILED: 'MEDIAPROC-VID-008',

  // =========================================================================
  // AUDIO (AUD) - Audio processing errors
  // =========================================================================
  
  /** Audio codec not found */
  AUDIO_CODEC_NOT_FOUND: 'MEDIAPROC-AUD-001',
  
  /** Audio conversion failed */
  AUDIO_CONVERSION_FAILED: 'MEDIAPROC-AUD-002',
  
  /** Unsupported audio format */
  AUDIO_FORMAT_UNSUPPORTED: 'MEDIAPROC-AUD-003',
  
  /** Audio file corrupted */
  AUDIO_FILE_CORRUPTED: 'MEDIAPROC-AUD-004',
  
  /** Audio normalization failed */
  AUDIO_NORMALIZATION_FAILED: 'MEDIAPROC-AUD-005',
  
  /** Invalid audio sample rate */
  AUDIO_SAMPLE_RATE_INVALID: 'MEDIAPROC-AUD-006',

  // =========================================================================
  // PIPELINE (PIPE) - Pipeline execution errors
  // =========================================================================
  
  /** Pipeline step failed */
  PIPELINE_STEP_FAILED: 'MEDIAPROC-PIPE-001',
  
  /** Pipeline configuration invalid */
  PIPELINE_CONFIG_INVALID: 'MEDIAPROC-PIPE-002',
  
  /** Pipeline execution timeout */
  PIPELINE_TIMEOUT: 'MEDIAPROC-PIPE-003',
  
  /** Pipeline input invalid */
  PIPELINE_INPUT_INVALID: 'MEDIAPROC-PIPE-004',
  
  /** Pipeline output failed */
  PIPELINE_OUTPUT_FAILED: 'MEDIAPROC-PIPE-005',

  // =========================================================================
  // CODEC (CODEC) - Codec and format errors
  // =========================================================================
  
  /** Codec initialization failed */
  CODEC_INIT_FAILED: 'MEDIAPROC-CODEC-001',
  
  /** Codec not supported */
  CODEC_NOT_SUPPORTED: 'MEDIAPROC-CODEC-002',
  
  /** Codec parameters invalid */
  CODEC_PARAMS_INVALID: 'MEDIAPROC-CODEC-003',

  // =========================================================================
  // GENERAL (GEN) - Generic utility errors (CLI, plugins, internal)
  // =========================================================================

  /** Invalid user input or arguments */
  GENERAL_INPUT_INVALID: 'MEDIAPROC-GEN-001',

  /** Validation failed */
  GENERAL_VALIDATION_FAILED: 'MEDIAPROC-GEN-002',

  /** Configuration is invalid or missing */
  GENERAL_CONFIG_INVALID: 'MEDIAPROC-GEN-003',

  /** Feature or format not supported */
  GENERAL_UNSUPPORTED: 'MEDIAPROC-GEN-004',

  /** Feature not yet implemented */
  GENERAL_NOT_IMPLEMENTED: 'MEDIAPROC-GEN-005',

  /** File system operation failed */
  GENERAL_FILESYSTEM_ERROR: 'MEDIAPROC-GEN-006',

  /** External tool execution failed */
  GENERAL_TOOL_ERROR: 'MEDIAPROC-GEN-007',

  /** Required dependency is missing */
  GENERAL_DEPENDENCY_MISSING: 'MEDIAPROC-GEN-008',

  /** Plugin execution error */
  GENERAL_PLUGIN_ERROR: 'MEDIAPROC-GEN-009',

  /** Plugin not found */
  GENERAL_PLUGIN_NOT_FOUND: 'MEDIAPROC-GEN-010',

  /** Operation cancelled by user */
  GENERAL_CANCELLED: 'MEDIAPROC-GEN-011',

  /** Internal or unexpected error */
  GENERAL_INTERNAL_ERROR: 'MEDIAPROC-GEN-012',

} as const;

/**
 * Type for MediaProc error codes
 */
export type MediaProcErrorCode = typeof MediaProcErrorCodes[keyof typeof MediaProcErrorCodes];

/**
 * Get category from MediaProc error code
 */
export function getMediaProcErrorCategory(code: MediaProcErrorCode): string {
  const match = code.match(/^MEDIAPROC-([A-Z]+)-\d+$/);
  return match?.[1] ?? 'UNKNOWN';
}

/**
 * Check if code is a MediaProc error code
 */
export function isMediaProcErrorCode(code: string): code is MediaProcErrorCode {
  return Object.values(MediaProcErrorCodes).includes(code as MediaProcErrorCode);
}
