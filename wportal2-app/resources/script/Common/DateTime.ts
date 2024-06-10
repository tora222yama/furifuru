import { EWeekDay } from '@/script/Enum/Server/App/EWeekDay';

export class DateTime {
  // UnixとJavaScriptのタイムスタンプの差.
  private static UNIX_JS_RATIO = 1000;

  // JavaScriptにおける１日相当のタイムスタンプ値.
  private static SPAN_DAY_JS = 24 * 60 * 60 * 1000;

  private readonly date: Date;

  constructor(jsTimeStamp: number) {
    this.date = new Date(jsTimeStamp);
  }

  /**
   * 現在時刻でインスタンスを取得.
   */
  public static now(): DateTime {
    return new DateTime(new Date().getTime());
  }

  public static parseString(value: string): DateTime {
    return new DateTime(Date.parse(value));
  }

  /**
   * parse.
   * @param unixTimeStamp
   */
  public static parseFromUnixTimeStamp(unixTimeStamp: number): DateTime {
    return new DateTime(unixTimeStamp * this.UNIX_JS_RATIO);
  }

  /**
   * 現在のDateを元に新しいDateのインスタンスを得る.
   * @private
   */
  private newDate(): Date {
    return new Date(this.date);
  }

  /**
   * 曜日の取得.
   */
  public getWeekDay(): EWeekDay {
    return this.date.getDay() as EWeekDay;
  }

  /**
   * 月初の取得.
   */
  public startOfMonth(): DateTime {
    const ret = this.newDate();
    ret.setDate(1);
    ret.setHours(0);
    ret.setMinutes(0);
    ret.setSeconds(0);
    ret.setMilliseconds(0);
    return new DateTime(ret.getTime());
  }

  /**
   * 月末の取得.
   */
  public endOfMonth(): DateTime {
    const ret = this.newDate();
    ret.setMonth(ret.getMonth() + 1);
    ret.setDate(0);
    ret.setHours(23);
    ret.setMinutes(59);
    ret.setSeconds(59);
    ret.setMilliseconds(999);
    return new DateTime(ret.getTime());
  }

  /**
   * 月の日数を得る.
   */
  public daysInMonth(): number {
    const startOfMonth = this.startOfMonth();
    const endOfMonth = this.endOfMonth();
    const diff = endOfMonth.toJsTimeStamp() - startOfMonth.toJsTimeStamp();

    return Math.ceil(diff / DateTime.SPAN_DAY_JS);
  }

  /**
   * 同じ日付かどうか.
   * @param target
   */
  public isSameDay(target: DateTime): boolean {
    return this.toDateJP() === target.toDateJP();
  }

  /**
   * 日付が範囲内かどうか.
   * @param min
   * @param max
   */
  public inRange(min: DateTime, max: DateTime): boolean {
    const targetTimeStamp = this.toJsTimeStamp();
    const minTimeStamp = min.toJsTimeStamp();
    const maxTimeStamp = max.toJsTimeStamp();

    if (targetTimeStamp < minTimeStamp) {
      return false;
    }
    if (targetTimeStamp > maxTimeStamp) {
      return false;
    }

    return true;
  }

  /**
   * 日付の加算.
   * @param addDays
   */
  public addDay(addDays = 1): DateTime {
    const ret = this.newDate();
    ret.setDate(ret.getDate() + addDays);
    return new DateTime(ret.getTime());
  }

  /**
   * 日付の減算.
   * @param subDays
   */
  public subDay(subDays = 1): DateTime {
    const ret = this.newDate();
    ret.setDate(ret.getDate() - subDays);
    return new DateTime(ret.getTime());
  }

  /**
   * 月の加算
   * @param addMonth
   */
  public addMonth(addMonth = 1): DateTime {
    const ret = this.newDate();
    ret.setMonth(ret.getMonth() + addMonth);
    return new DateTime(ret.getTime());
  }

  /**
   * 月の減算.
   * @param subMonth
   */
  public subMonth(subMonth = 1): DateTime {
    const ret = this.newDate();
    ret.setMonth(ret.getMonth() - subMonth);
    return new DateTime(ret.getTime());
  }

  /**
   * JavaScriptのタイムスタンプにする.
   */
  public toJsTimeStamp(): number {
    return this.date.getTime();
  }

  /**
   * Unix(PHP)のタイムスタンプにする.
   */
  public toUnixTimeStamp(): number {
    return Math.floor(this.date.getTime() / 1000);
  }

  /**
   * yyyy/MM/dd HH:mm:ssで表示
   */
  public toDateTime(): string {
    return this.format('yyyy/MM/dd HH:mm:ss');
  }

  /**
   * HH:mm だけ表示.
   */
  public toHHMM(): string {
    return this.format('HH:mm');
  }

  /**
   * 日付（日本語表示)
   */
  public toDateJP(): string {
    return this.format('yyyy年MM月dd日');
  }

  /**
   * 任意のフォーマットに表示.
   * @param format
   */
  public toFormatString(format: string): string {
    return this.format(format);
  }

  /**
   * format.
   */
  private format(format: string) {
    let ret = format;
    ret = ret.replace('yyyy', String(this.date.getFullYear()));
    ret = ret.replace('MM', `0${String(this.date.getMonth() + 1)}`.slice(-2));
    ret = ret.replace('dd', `0${String(this.date.getDate())}`.slice(-2));
    ret = ret.replace('HH', `0${String(this.date.getHours())}`.slice(-2));
    ret = ret.replace('mm', `0${String(this.date.getMinutes())}`.slice(-2));
    ret = ret.replace('ss', `0${String(this.date.getSeconds())}`.slice(-2));
    return ret;
  }
}
