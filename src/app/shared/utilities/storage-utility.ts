export class cookieUtil {
  public static storage(key: string, value: unknown) {
    localStorage.setItem(key, value?.toString() || '');
  }

  public static getValue(key: string) {
    return localStorage.getItem(key);
  }

  public static remove(key: string) {
    localStorage.removeItem(key);
  }

  public static removeAll() {
    localStorage.clear();
  }
}
