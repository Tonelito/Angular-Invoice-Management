// Common properties shared by both Profile and Role
interface Common {
  name: string;
  description: string;
  status: boolean;
}

export interface Profile extends Common {
  profileId: number;
}

export interface Role extends Common {
  rolId: number;
}

export interface Roles {
  note: string;
  object: Role[];
}

export interface Profiles {
  note: string;
  object: {
    note: string;
    object: Profile[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface ProfileWithRoles extends Profile {
  rolsId: Role[];
}

// Generic response interface for single profile
export interface ProfileResponse {
  note: string;
  object: ProfileWithRoles;
}

//Profile without status and id
export interface CreateProfile {
  name: string;
  description: string;
  rolsId: number[];
}
