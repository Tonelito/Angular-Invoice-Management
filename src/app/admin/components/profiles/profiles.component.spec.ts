import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { ProfilesComponent } from './profiles.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { ProfilesService } from '../../services/profiles.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BlockUIModule } from 'ng-block-ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  Role,
  Profiles,
  Roles,
  ProfileResponse,
  ProfileWithRoles,
  CreateProfile,
  Profile
} from '../../utilities/models/profile.model';

describe('ProfilesComponent', () => {
  let component: ProfilesComponent;
  let fixture: ComponentFixture<ProfilesComponent>;
  let profilesService: jasmine.SpyObj<ProfilesService>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockRole: Role = {
    rolId: 1,
    name: 'Admin',
    description: 'Administrator',
    status: true
  };

  const mockProfileWithRoles: ProfileWithRoles = {
    profileId: 1,
    name: 'Test Profile',
    description: 'Test Description',
    status: true,
    rolsId: [mockRole]
  };

  const mockProfiles: Profiles = {
    note: 'Success',
    object: {
      note: 'Success',
      object: [
        {
          profileId: 1,
          name: 'Test Profile',
          description: 'Test Description',
          status: true
        }
      ],
      totalElements: 1,
      totalPages: 1,
      currentPage: 0,
      pageSize: 10
    }
  };

  const mockRoles: Roles = {
    note: 'Success',
    object: [mockRole]
  };

  const mockProfileResponse: ProfileResponse = {
    note: 'Success',
    object: mockProfileWithRoles
  };

  const mockTranslateService = {
    instant: jasmine.createSpy('instant').and.callFake((key: string) => key)
  };

  beforeEach(async () => {
    const profilesServiceSpy = jasmine.createSpyObj('ProfilesService', [
      'getProfiles',
      'getRoles',
      'getProfile',
      'postProfile',
      'putProfile',
      'deleteProfile',
      'deleteProfileDetails',
      'changeStatus'
    ]);
    const notificationsServiceSpy = jasmine.createSpyObj(
      'NotificationsService',
      ['success', 'error']
    );
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ProfilesComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatPaginatorModule,
        MatTableModule,
        BlockUIModule.forRoot(),
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        TranslateModule.forRoot()
      ],
      providers: [
        FormBuilder,
        { provide: ProfilesService, useValue: profilesServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        TranslateService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    profilesService = TestBed.inject(
      ProfilesService
    ) as jasmine.SpyObj<ProfilesService>;
    notificationsService = TestBed.inject(
      NotificationsService
    ) as jasmine.SpyObj<NotificationsService>;
    TestBed.inject(TranslateService);
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    // Setup default spy returns
    profilesService.getProfiles.and.returnValue(of(mockProfiles));
    profilesService.getRoles.and.returnValue(of(mockRoles));
    profilesService.getProfile.and.returnValue(of(mockProfileResponse));
    profilesService.deleteProfileDetails.and.returnValue(of(undefined));
    profilesService.deleteProfile.and.returnValue(of(undefined));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should fetch profiles on init', () => {
      component.ngOnInit();
      expect(profilesService.getProfiles).toHaveBeenCalled();
      expect(component.profiles.length).toBe(1);
      expect(component.totalProfiles).toBe(mockProfiles.object.totalElements);
    });

    it('should fetch roles on init', () => {
      component.ngOnInit();
      expect(profilesService.getRoles).toHaveBeenCalled();
      expect(component.roles).toEqual(mockRoles.object);
    });
  });

  describe('Form Validation', () => {
    it('should initialize with invalid form', () => {
      expect(component.profileForm.valid).toBeFalsy();
    });

    it('should validate required fields', () => {
      const form = component.profileForm;
      expect(form.get('name')?.errors?.['required']).toBeTruthy();
      expect(form.get('description')?.errors?.['required']).toBeTruthy();
    });

    it('should be valid with correct data', () => {
      component.profileForm.patchValue({
        name: 'Valid Name',
        description: 'Valid Description'
      });
      expect(component.profileForm.valid).toBeTruthy();
    });
  });

  describe('Profile Operations', () => {
    it('should fetch profile details', fakeAsync(() => {
      component.fetchProfileDetails(1);
      tick();

      expect(profilesService.getProfile).toHaveBeenCalledWith(1);
      expect(component.isEditing).toBeTrue();
      expect(component.selectedProfileId).toBe(
        mockProfileResponse.object.profileId
      );
    }));

    it('should add new profile when form is valid', fakeAsync(() => {
      const mockCreateProfile: CreateProfile = {
        name: 'New Profile',
        description: 'New Description',
        rolsId: [1]
      };

      profilesService.postProfile.and.returnValue(
        of({ note: 'Success', object: mockProfileWithRoles })
      );

      component.profileForm.patchValue({
        name: mockCreateProfile.name,
        description: mockCreateProfile.description
      });
      component.selectedRoles = mockCreateProfile.rolsId;

      component.addProfile();
      tick();

      expect(profilesService.postProfile).toHaveBeenCalledWith(
        mockCreateProfile
      );
      expect(notificationsService.success).toHaveBeenCalled();
    }));

    it('should update existing profile', fakeAsync(() => {
      const mockUpdateProfile: CreateProfile = {
        name: 'Updated Profile',
        description: 'Updated Description',
        rolsId: [1]
      };

      profilesService.putProfile.and.returnValue(
        of({
          note: 'Success',
          object: mockProfileWithRoles
        })
      );

      component.selectedProfileId = 1;
      component.isEditing = true;
      component.profileForm.patchValue({
        name: mockUpdateProfile.name,
        description: mockUpdateProfile.description
      });
      component.selectedRoles = mockUpdateProfile.rolsId;

      component.updateProfiles();
      tick();

      expect(profilesService.putProfile).toHaveBeenCalledWith(
        1,
        mockUpdateProfile
      );
      expect(notificationsService.success).toHaveBeenCalled();
    }));

    it('should handle profile deletion', fakeAsync(() => {
      const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
      dialog.open.and.returnValue(dialogRefSpyObj);

      profilesService.deleteProfileDetails.and.returnValue(of(undefined));
      profilesService.deleteProfile.and.returnValue(of(undefined));

      component.confirmDeleteProfile(mockProfiles.object.object[0]);
      tick();

      expect(dialog.open).toHaveBeenCalled();
      expect(profilesService.deleteProfileDetails).toHaveBeenCalledWith(1);
      expect(profilesService.deleteProfile).toHaveBeenCalledWith(1);
      expect(notificationsService.success).toHaveBeenCalled();
    }));

    it('should handle status change', fakeAsync(() => {
      const mockProfile: Profile = {
        profileId: 1,
        name: 'Test Profile',
        description: 'Test Description',
        status: true
      };

      profilesService.changeStatus.and.returnValue(of(mockProfile));

      component.changeStatus(1);
      tick();

      expect(profilesService.changeStatus).toHaveBeenCalledWith(1);
      expect(notificationsService.success).toHaveBeenCalled();
    }));
  });

  describe('Role Management', () => {
    it('should toggle role selection', () => {
      component.toggleRole(1, true);
      expect(component.selectedRoles).toContain(1);

      component.toggleRole(1, false);
      expect(component.selectedRoles).not.toContain(1);
    });
  });

  describe('Pagination', () => {
    it('should handle page changes', () => {
      const event = { pageIndex: 0, pageSize: 10 };
      component.onPageChange(event);

      expect(component.currentPage).toBe(0);
      expect(component.pageSize).toBe(10);
      expect(profilesService.getProfiles).toHaveBeenCalledWith(0, 10);
    });
  });

  describe('Error Handling', () => {
    let consoleErrorSpy: jasmine.Spy;

    beforeEach(() => {
      consoleErrorSpy = spyOn(console, 'error');
    });

    afterEach(() => {
      consoleErrorSpy.calls.reset();
    });

    it('should handle profile fetch error', fakeAsync(() => {
      const errorMessage = 'Error fetching profiles';
      profilesService.getProfiles.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.profiles = [];
      component.filteredProfiles.data = [];

      component.fetchProfiles();
      tick();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching profiles:',
        jasmine.any(Error)
      );
      expect(component.blockUI.isActive).toBeFalsy();
      expect(component.filteredProfiles.data.length).toBe(0);
      expect(component.profiles.length).toBe(0);
    }));

    it('should handle errors when fetching profiles', fakeAsync(() => {
      const errorMessage = 'Test error message';
      profilesService.getProfiles.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.profiles = [];
      component.filteredProfiles.data = [];

      component.fetchProfiles();
      tick();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching profiles:',
        jasmine.any(Error)
      );
      expect(component.filteredProfiles.data.length).toBe(0);
    }));

    it('should handle errors when fetching roles', fakeAsync(() => {
      const errorMessage = 'Test error message';
      profilesService.getRoles.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.roles = [];

      component.fetchRoles();
      tick();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching roles',
        jasmine.any(Error)
      );
      expect(component.roles.length).toBe(0);
    }));

    it('should handle errors when fetching profile details', fakeAsync(() => {
      const errorMessage = 'Test error message';
      profilesService.getProfile.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.fetchProfileDetails(1);
      tick();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'PROFILES.ERRORS.FETCH_PROFILE',
        jasmine.any(Error)
      );
    }));

    it('should handle errors when adding a profile', fakeAsync(() => {
      const errorMessage = 'Test error message';

      profilesService.postProfile.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.profileForm.patchValue({
        name: 'Test Profile',
        description: 'Test Description'
      });
      component.selectedRoles = [1];

      component.addProfile();
      tick();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error saving profile:',
        jasmine.any(Error)
      );
      expect(notificationsService.error).toHaveBeenCalledWith(
        mockTranslateService.instant(
          'PROFILES.NOTIFICATIONS.PROFILE_CREATION_FAILURE'
        ),
        mockTranslateService.instant(
          'PROFILES.NOTIFICATIONS.PROFILE_CREATION_FAILURE_DESC'
        )
      );
    }));

    it('should handle errors when updating a profile', fakeAsync(() => {
      const errorMessage = 'Test error message';

      profilesService.putProfile.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.selectedProfileId = 1;
      component.isEditing = true;
      component.profileForm.patchValue({
        name: 'Updated Profile',
        description: 'Updated Description'
      });
      component.selectedRoles = [1];

      component.updateProfiles();
      tick();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'PROFILES.ERRORS.UPDATE_PROFILE',
        jasmine.any(Error)
      );
      expect(notificationsService.error).toHaveBeenCalledWith(
        mockTranslateService.instant('PROFILES.NOTIFICATIONS.UPDATE_FAILURE')
      );
    }));

    it('should handle errors when changing profile status', fakeAsync(() => {
      const errorMessage = 'Test error message';
      profilesService.changeStatus.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.changeStatus(1);
      tick();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'PROFILES.ERRORS.STATUS_TOGGLE',
        jasmine.any(Error)
      );
      expect(notificationsService.error).toHaveBeenCalledWith(
        mockTranslateService.instant('PROFILES.NOTIFICATIONS.STATUS_FAILURE')
      );
    }));

    it('should handle errors when deleting a profile', fakeAsync(() => {
      const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
      dialog.open.and.returnValue(dialogRefSpyObj);
      const errorMessage = 'Test error message';
      profilesService.deleteProfileDetails.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.confirmDeleteProfile(mockProfiles.object.object[0]);
      tick();

      expect(notificationsService.error).toHaveBeenCalledWith(
        mockTranslateService.instant(
          'PROFILES.NOTIFICATIONS.PROFILE_DELETE_FAILED'
        ),
        mockTranslateService.instant(
          'PROFILES.NOTIFICATIONS.PROFILE_DELETE_FAILED_DESC'
        )
      );
    }));
  });
});
