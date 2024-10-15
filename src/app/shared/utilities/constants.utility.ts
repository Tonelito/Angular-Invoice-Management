import { environment } from 'src/environments/environment';

// API GETAWAY
export const API_URL_SECURITY = environment.apiSecurity;
export const API_URL_PROFILES = environment.apiProfiles;
export const API_URL_ROLES = environment.apiRoles;
export const API_URL_AUDIT = environment.apiAudit;
export const API_URL_PROFILE_ROLE_DETAIL = environment.apiProfileRoleDetail;
export const API_URL_USER = environment.apiUser;
export const API_URL_CUSTOMER = environment.apiCustomer;
export const AUTHORITIES = 'authorities';
export const EXP = 'exp';

// Regex
export const REGEX_NAME = '^[a-zA-Z0-9_ ]{3,15}$';
export const REGEX_DESCRIPTION = '^(?=.*\\S)[a-zA-Z0-9_ ]{3,75}$';
export const REGEX_PASSWORD = '^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{6,}$';
export const REGEX_PHONE = '^[0-9]{10}$';
export const REGEX_NUMBER = '^[0-9]*$';
export const REGEX_NUMBER_DPI = '^[0-9]{13}$';
export const REGEX_NUMBER_NIT = '^[0-9]{8,9}$';
