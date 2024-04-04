/**
 * ログ出力
 */
export class Log {
  /**
   * info出力.
   * @param log
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static info(log: any): void {
    // eslint-disable-next-line no-console
    console.log(log);
  }

  /**
   * error出力.
   * @param log
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static error(log: any): void {
    // eslint-disable-next-line no-console
    console.error(log);
  }
}
