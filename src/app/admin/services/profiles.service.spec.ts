import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ProfilesService } from './profiles.service';
import {
  API_URL_PROFILE_ROLE_DETAIL,
  API_URL_PROFILES,
  API_URL_ROLES
} from 'src/app/shared/utilities/constants.utility';
import {
  Profile,
  ProfileResponse,
  Profiles,
  CreateProfile,
  Roles
} from '../utilities/models/profile.model';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfilesService]
    });
    service = TestBed.inject(ProfilesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockProfile: Profile = {
    profileId: 1,
    name: 'Test Profile',
    description: 'Test Description',
    status: true
  };

  const mockCreateProfile: CreateProfile = {
    name: 'New Profile',
    description: 'New Description',
    rolsId: [1, 2]
  };

  const mockProfileResponse: ProfileResponse = {
    note: 'Success',
    object: {
      ...mockProfile,
      rolsId: [
        {
          rolId: 1,
          name: 'Role 1',
          description: 'Role 1 Description',
          status: true
        },
        {
          rolId: 2,
          name: 'Role 2',
          description: 'Role 2 Description',
          status: true
        }
      ]
    }
  };

  const mockProfiles: Profiles = {
    note: 'Success',
    object: {
      note: 'Success',
      object: [mockProfile],
      totalElements: 1,
      totalPages: 1,
      currentPage: 0,
      pageSize: 10
    }
  };

  const mockRoles: Roles = {
    note: 'Success',
    object: [
      {
        rolId: 1,
        name: 'Role 1',
        description: 'Role 1 Description',
        status: true
      },
      {
        rolId: 2,
        name: 'Role 2',
        description: 'Role 2 Description',
        status: true
      }
    ]
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRoles', () => {
    it('should return all roles', () => {
      service.getRoles().subscribe(response => {
        expect(response).toEqual(mockRoles);
      });

      const req = httpMock.expectOne(`${API_URL_ROLES}/show-all`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRoles);
    });
  });

  describe('getProfiles', () => {
    it('should return paginated profiles with default parameters', () => {
      service.getProfiles().subscribe(response => {
        expect(response).toEqual(mockProfiles);
      });

      const req = httpMock.expectOne(
        `${API_URL_PROFILES}/show-all?page=0&size=10`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProfiles);
    });

    it('should return paginated profiles with custom parameters', () => {
      const page = 1;
      const pageSize = 20;

      service.getProfiles(page, pageSize).subscribe(response => {
        expect(response).toEqual(mockProfiles);
      });

      const req = httpMock.expectOne(
        `${API_URL_PROFILES}/show-all?page=${page}&size=${pageSize}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProfiles);
    });
  });

  describe('getProfile', () => {
    it('should return a single profile by id', () => {
      const profileId = 1;

      service.getProfile(profileId).subscribe(response => {
        expect(response).toEqual(mockProfileResponse);
      });

      const req = httpMock.expectOne(
        `${API_URL_PROFILES}/show-by-id/${profileId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProfileResponse);
    });
  });

  describe('postProfile', () => {
    it('should create a new profile', () => {
      service.postProfile(mockCreateProfile).subscribe(response => {
        expect(response).toEqual(mockProfileResponse);
      });

      const req = httpMock.expectOne(`${API_URL_PROFILES}/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateProfile);
      req.flush(mockProfileResponse);
    });
  });

  describe('putProfile', () => {
    it('should update an existing profile', () => {
      const profileId = 1;

      service.putProfile(profileId, mockCreateProfile).subscribe(response => {
        expect(response).toEqual(mockProfileResponse);
      });

      const req = httpMock.expectOne(`${API_URL_PROFILES}/update/${profileId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockCreateProfile);
      req.flush(mockProfileResponse);
    });
  });

  describe('changeStatus', () => {
    it('should change profile status', () => {
      const profileId = 1;

      service.changeStatus(profileId).subscribe(response => {
        expect(response).toEqual(mockProfile);
      });

      const req = httpMock.expectOne(
        `${API_URL_PROFILES}/status-change/${profileId}`
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockProfile);
    });
  });

  describe('deleteProfileDetails', () => {
    it('should delete profile details', done => {
      const profileId = 1;
      let completed = false;

      service.deleteProfileDetails(profileId).subscribe({
        complete: () => {
          completed = true;
          done();
        }
      });

      const req = httpMock.expectOne(
        `${API_URL_PROFILE_ROLE_DETAIL}/delete/${profileId}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(completed).toBeTrue();
    });
  });

  describe('deleteProfile', () => {
    it('should delete a profile', done => {
      const profileId = 1;
      let completed = false;

      service.deleteProfile(profileId).subscribe({
        complete: () => {
          completed = true;
          done();
        }
      });

      const req = httpMock.expectOne(`${API_URL_PROFILES}/delete/${profileId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(completed).toBeTrue();
    });
  });

  describe('Error handling', () => {
    it('should handle HTTP errors', () => {
      const profileId = 1;
      const errorMessage = 'An error occurred';

      service.getProfile(profileId).subscribe({
        error: error => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(
        `${API_URL_PROFILES}/show-by-id/${profileId}`
      );
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });
});
