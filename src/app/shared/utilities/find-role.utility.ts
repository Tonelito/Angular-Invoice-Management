import * as CONSTS from './constants.utility';
import { CookieUtil } from './storage-utility';
export class FindRoleUtil {
  public static validAuthority(rol: string): boolean {
    const cookie = CookieUtil.getValue(CONSTS.AUTHORITIES);
    const authorities = cookie?.split(',');
    return Boolean(authorities?.find(item => item === rol) ?? false);
  }
}
