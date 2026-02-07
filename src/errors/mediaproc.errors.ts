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
