export interface ExpoWebGLRenderingContext extends WebGL2RenderingContext {
  contextId: number;
  endFrameEXP(): void;
  flushEXP(): void;
  __expoSetLogging(option: GLLoggingOption): void;
}

// @needsAudit
export enum GLLoggingOption {
  /**
   * Disables logging entirely.
   */
  DISABLED = 0,
  /**
   * Logs method calls, their parameters and results.
   */
  METHOD_CALLS = 1,
  /**
   * Calls `gl.getError()` after each other method call and prints an error if any is returned.
   * This option has a significant impact on the performance as this method is blocking.
   */
  GET_ERRORS = 2,
  /**
   * Resolves parameters of type `number` to their constant names.
   */
  RESOLVE_CONSTANTS = 4,
  /**
   * When this option is enabled, long strings will be truncated.
   * It's useful if your shaders are really big and logging them significantly reduces performance.
   */
  TRUNCATE_STRINGS = 8,
  /**
   * Enables all other options. It implies `GET_ERRORS` so be aware of the slowdown.
   */
  ALL = METHOD_CALLS | GET_ERRORS | RESOLVE_CONSTANTS | TRUNCATE_STRINGS
}
