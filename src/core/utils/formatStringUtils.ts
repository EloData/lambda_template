export class FormatStringUtils {
  public static normalizeValue(value: string): string {
    return value.trim().replace(/[^a-zA-Z0-9]/g, '');
  }
}
