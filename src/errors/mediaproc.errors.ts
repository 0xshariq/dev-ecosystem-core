/**
 * MediaProc Error Classes
 * 
 * Concrete error implementations for the MediaProc media processing framework.
 * All errors extend BaseError and use MediaProcErrorCodes.
 * 
 * @category MediaProc
 * @public
 */

import { BaseError } from './BaseError.js';
import { ErrorType, ErrorSeverity } from './ErrorTypes.js';
import { ExitCodes } from '../exit-codes/ExitCodes.js';
import { MediaProcErrorCodes } from './mediaproc.codes.js';

// ============================================================================
// IMAGE ERRORS
// ============================================================================

export class ImageFormatUnsupportedError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.IMAGE_FORMAT_UNSUPPORTED;
  readonly exitCode = ExitCodes.INVALID_FORMAT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class ImageResizeError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.IMAGE_RESIZE_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class ImageConversionError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.IMAGE_CONVERSION_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class ImageFileCorruptedError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.IMAGE_FILE_CORRUPTED;
  readonly exitCode = ExitCodes.INVALID_FILE;
  override readonly severity = ErrorSeverity.HIGH;
}

export class ImageWatermarkError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.IMAGE_WATERMARK_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class ImageDimensionsInvalidError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.IMAGE_DIMENSIONS_INVALID;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class ImageOptimizationError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.IMAGE_OPTIMIZATION_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class ImageMetadataError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.IMAGE_METADATA_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.LOW;
}

// ============================================================================
// VIDEO ERRORS
// ============================================================================

export class VideoCodecNotFoundError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.CONFIG;
  readonly code = MediaProcErrorCodes.VIDEO_CODEC_NOT_FOUND;
  readonly exitCode = ExitCodes.MISSING_DEPENDENCY;
  override readonly severity = ErrorSeverity.HIGH;
}

export class VideoTranscodeError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.VIDEO_TRANSCODE_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.MEDIUM;
  override readonly retryable = true;
}

export class VideoFormatUnsupportedError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.VIDEO_FORMAT_UNSUPPORTED;
  readonly exitCode = ExitCodes.INVALID_FORMAT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class VideoFileCorruptedError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.VIDEO_FILE_CORRUPTED;
  readonly exitCode = ExitCodes.INVALID_FILE;
  override readonly severity = ErrorSeverity.HIGH;
}

export class VideoEncodingError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.VIDEO_ENCODING_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.HIGH;
  override readonly retryable = true;
}

export class VideoDecodingError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.VIDEO_DECODING_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.HIGH;
}

export class VideoBitrateInvalidError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.VIDEO_BITRATE_INVALID;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class VideoFrameExtractionError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.VIDEO_FRAME_EXTRACTION_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.MEDIUM;
}

// ============================================================================
// AUDIO ERRORS
// ============================================================================

export class AudioCodecNotFoundError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.CONFIG;
  readonly code = MediaProcErrorCodes.AUDIO_CODEC_NOT_FOUND;
  readonly exitCode = ExitCodes.MISSING_DEPENDENCY;
  override readonly severity = ErrorSeverity.HIGH;
}

export class AudioConversionError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.AUDIO_CONVERSION_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class AudioFormatUnsupportedError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.AUDIO_FORMAT_UNSUPPORTED;
  readonly exitCode = ExitCodes.INVALID_FORMAT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class AudioFileCorruptedError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.AUDIO_FILE_CORRUPTED;
  readonly exitCode = ExitCodes.INVALID_FILE;
  override readonly severity = ErrorSeverity.HIGH;
}

export class AudioNormalizationError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.AUDIO_NORMALIZATION_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class AudioSampleRateInvalidError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.AUDIO_SAMPLE_RATE_INVALID;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

// ============================================================================
// PIPELINE ERRORS
// ============================================================================

export class PipelineStepError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.PIPELINE_STEP_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.HIGH;
}

export class PipelineConfigurationError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.CONFIG;
  readonly code = MediaProcErrorCodes.PIPELINE_CONFIG_INVALID;
  readonly exitCode = ExitCodes.INVALID_CONFIG;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class PipelineTimeoutError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.PIPELINE_TIMEOUT;
  readonly exitCode = ExitCodes.TIMEOUT;
  override readonly severity = ErrorSeverity.MEDIUM;
  override readonly retryable = true;
}

export class PipelineInputInvalidError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.PIPELINE_INPUT_INVALID;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class PipelineOutputError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.PIPELINE_OUTPUT_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.HIGH;
}

// ============================================================================
// CODEC ERRORS
// ============================================================================

export class CodecInitError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.CONFIG;
  readonly code = MediaProcErrorCodes.CODEC_INIT_FAILED;
  readonly exitCode = ExitCodes.INITIALIZATION_FAILED;
  override readonly severity = ErrorSeverity.CRITICAL;
}

export class CodecNotSupportedError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.CODEC_NOT_SUPPORTED;
  readonly exitCode = ExitCodes.INVALID_FORMAT;
  override readonly severity = ErrorSeverity.HIGH;
}

export class CodecParamsInvalidError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.CODEC_PARAMS_INVALID;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

// ============================================================================
// GENERAL ERRORS
// ============================================================================

export class MediaProcInputError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.GENERAL_INPUT_INVALID;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class MediaProcValidationError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.GENERAL_VALIDATION_FAILED;
  readonly exitCode = ExitCodes.VALIDATION_FAILED;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class MediaProcConfigError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.CONFIG;
  readonly code = MediaProcErrorCodes.GENERAL_CONFIG_INVALID;
  readonly exitCode = ExitCodes.INVALID_CONFIG;
  override readonly severity = ErrorSeverity.HIGH;
}

export class MediaProcUnsupportedError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.USER;
  readonly code = MediaProcErrorCodes.GENERAL_UNSUPPORTED;
  readonly exitCode = ExitCodes.INVALID_FORMAT;
  override readonly severity = ErrorSeverity.HIGH;
}

export class MediaProcNotImplementedError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.INTERNAL;
  readonly code = MediaProcErrorCodes.GENERAL_NOT_IMPLEMENTED;
  readonly exitCode = ExitCodes.BUG_DETECTED;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class MediaProcFilesystemError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.SYSTEM;
  readonly code = MediaProcErrorCodes.GENERAL_FILESYSTEM_ERROR;
  readonly exitCode = ExitCodes.FILESYSTEM_ERROR;
  override readonly severity = ErrorSeverity.HIGH;
}

export class MediaProcToolError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.GENERAL_TOOL_ERROR;
  readonly exitCode = ExitCodes.ADAPTER_FAILED;
  override readonly severity = ErrorSeverity.CRITICAL;
}

export class MediaProcDependencyError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.CONFIG;
  readonly code = MediaProcErrorCodes.GENERAL_DEPENDENCY_MISSING;
  readonly exitCode = ExitCodes.MISSING_DEPENDENCY;
  override readonly severity = ErrorSeverity.CRITICAL;
}

export class MediaProcPluginError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.GENERAL_PLUGIN_ERROR;
  readonly exitCode = ExitCodes.PLUGIN_FAILED;
  override readonly severity = ErrorSeverity.HIGH;
}

export class MediaProcPluginNotFoundError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.GENERAL_PLUGIN_NOT_FOUND;
  readonly exitCode = ExitCodes.PLUGIN_FAILED;
  override readonly severity = ErrorSeverity.CRITICAL;
}

export class MediaProcCancelledError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.EXECUTION;
  readonly code = MediaProcErrorCodes.GENERAL_CANCELLED;
  readonly exitCode = ExitCodes.WORKFLOW_FAILED;
  override readonly severity = ErrorSeverity.LOW;
}

export class MediaProcInternalError extends BaseError {
  readonly component = 'mediaproc';
  readonly type = ErrorType.INTERNAL;
  readonly code = MediaProcErrorCodes.GENERAL_INTERNAL_ERROR;
  readonly exitCode = ExitCodes.INTERNAL_ERROR;
  override readonly severity = ErrorSeverity.CRITICAL;
}
