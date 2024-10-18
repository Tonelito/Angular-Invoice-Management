import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProfilesService } from '../../services/profiles.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog } from '@angular/material/dialog';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error-state-matcher.utility';
import {
  CreateProfile,
  Profile,
  Role
} from '../../utilities/models/profile.model';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs';
import {
  REGEX_DESCRIPTION,
  REGEX_NAME
} from 'src/app/shared/utilities/constants.utility';
import { whitespaceCleaner } from 'src/app/shared/utilities/whitespace-cleaner.utility';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  //form
  profileForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  selectedProfileId!: number;
  isEditing: boolean = false;
  profileStatus!: boolean;

  //data models
  profiles: Profile[] = [];
  roles: Role[] = [];
  filteredProfiles: MatTableDataSource<Profile> = new MatTableDataSource();
  selectedRoles: number[] = [];

  //pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 10;
  currentPage = 0;
  totalProfiles = 0;
  searchQuery = '';

  //notifications and block-ui
  @BlockUI() blockUI!: NgBlockUI;
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

  constructor(
    private readonly _notifications: NotificationsService,
    private readonly translate: TranslateService,
    private readonly profilesService: ProfilesService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(REGEX_NAME)]],
      description: [
        '',
        [Validators.required, Validators.pattern(REGEX_DESCRIPTION)]
      ]
    });
  }

  ngOnInit(): void {
    this.fetchProfiles();
    this.fetchRoles();
  }

  fetchProfiles(): void {
    this.blockUI.start();
    this.profilesService
      .getProfiles(this.currentPage, this.pageSize)
      .subscribe({
        next: profiles => {
          if (profiles.object) {
            this.profiles = profiles.object.object;
            this.filteredProfiles = new MatTableDataSource(this.profiles);
            this.currentPage = profiles.object.currentPage;
            this.totalProfiles = profiles.object.totalElements;
          }
          this.blockUI.stop();
        },
        error: error => {
          console.error('Error fetching profiles:', error);
          this.blockUI.stop();
        }
      });
  }

  fetchRoles(): void {
    this.blockUI.start();
    this.profilesService.getRoles().subscribe({
      next: roles => {
        if (roles.object) {
          this.roles = roles.object;
        }
        this.blockUI.stop();
      },
      error: error => {
        console.error('Error fetching roles', error);
        this.blockUI.stop();
      }
    });
  }

  fetchProfileDetails(profileId: number): void {
    this.profilesService.getProfile(profileId).subscribe({
      next: response => {
        this.selectedProfileId = response.object.profileId;
        this.profileForm.patchValue({
          name: response.object.name,
          description: response.object.description,
          status: response.object.status
        });
        this.selectedRoles = response.object.rolsId.map(role => role.rolId);
        this.isEditing = true;
        this.profileStatus = response.object.status;
      },
      error: error => {
        console.error(
          this.translate.instant('PROFILES.ERRORS.FETCH_PROFILE'),
          error
        );
      }
    });
  }

  toggleRole(roleId: number, checked: boolean): void {
    if (checked) {
      this.selectedRoles.push(roleId);
    } else {
      this.selectedRoles = this.selectedRoles.filter(id => id !== roleId);
    }
    this.profileForm.markAsDirty();
  }

  addProfile(): void {
    if (this.profileForm.valid) {
      const cleanDescription = whitespaceCleaner(
        this.profileForm.value.description
      );
      const profileData: CreateProfile = {
        name: this.profileForm.value.name,
        description: cleanDescription,
        rolsId: this.selectedRoles
      };
      this.blockUI.start(
        this.translate.instant('PROFILES.NOTIFICATIONS.CREATING_PROFILE')
      );

      this.profilesService.postProfile(profileData).subscribe({
        next: response => {
          this._notifications.success(
            this.translate.instant('PROFILES.NOTIFICATIONS.PROFILE_CREATED'),
            this.translate.instant(
              'PROFILES.NOTIFICATIONS.PROFILE_CREATED_DESC'
            )
          );
          this.fetchProfiles();
          this.fetchRoles();
          this.profileForm.reset();
          this.selectedRoles = [];
          this.blockUI.stop();
        },
        error: error => {
          console.error('Error saving profile:', error);
          this._notifications.error(
            this.translate.instant(
              'PROFILES.NOTIFICATIONS.PROFILE_CREATION_FAILURE'
            ),
            this.translate.instant(
              'PROFILES.NOTIFICATIONS.PROFILE_CREATION_FAILURE_DESC'
            )
          );
          this.blockUI.stop();
        }
      });
    } else {
      this._notifications.error(
        this.translate.instant('PROFILES.NOTIFICATIONS.INVALID_FORM'),
        this.translate.instant('PROFILES.NOTIFICATIONS.INVALID_FORM_DESC')
      );
    }
  }

  updateProfiles(): void {
    if (this.profileForm.valid) {
      const cleanDescription = whitespaceCleaner(
        this.profileForm.value.description
      );
      const updatedProfile = {
        name: this.profileForm.value.name,
        description: cleanDescription,
        rolsId: this.selectedRoles
      };

      this.profilesService
        .putProfile(this.selectedProfileId, updatedProfile)
        .subscribe({
          next: () => {
            this._notifications.success(
              this.translate.instant('PROFILES.NOTIFICATIONS.UPDATE_SUCCESS')
            );
            this.fetchProfiles();
            this.profileForm.reset();
            this.selectedRoles = [];
          },
          error: error => {
            console.error(
              this.translate.instant('PROFILES.ERRORS.UPDATE_PROFILE'),
              error
            );
            this._notifications.error(
              this.translate.instant('PROFILES.NOTIFICATIONS.UPDATE_FAILURE')
            );
          }
        });
    }
  }

  changeStatus(profileId: number): void {
    this.profilesService.changeStatus(profileId).subscribe({
      next: response => {
        this._notifications.success(
          this.translate.instant('PROFILES.NOTIFICATIONS.STATUS_SUCCESS', '')
        );
        this.profileForm.reset();
        this.selectedRoles = [];
        this.fetchProfiles();
      },
      error: error => {
        console.error(
          this.translate.instant('PROFILES.ERRORS.STATUS_TOGGLE'),
          error
        );
        this._notifications.error(
          this.translate.instant('PROFILES.NOTIFICATIONS.STATUS_FAILURE')
        );
      }
    });
  }

  confirmDeleteProfile(profile: Profile): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('PROFILES.DIALOG.TITLE'),
        message: this.translate.instant('PROFILES.DIALOG.MESSAGE', {
          profileName: profile.name
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProfile(profile.profileId);
      }
    });
  }

  deleteProfile(profileId: number): void {
    this.blockUI.start(
      this.translate.instant('PROFILES.NOTIFICATIONS.DELETING_PROFILE')
    );

    this.profilesService
      .deleteProfileDetails(profileId)
      .pipe(switchMap(() => this.profilesService.deleteProfile(profileId)))
      .subscribe({
        next: () => {
          this._notifications.success(
            this.translate.instant('PROFILES.NOTIFICATIONS.PROFILE_DELETED'),
            this.translate.instant(
              'PROFILES.NOTIFICATIONS.PROFILE_DELETED_DESC'
            )
          );
          this.fetchProfiles();
          this.blockUI.stop();
        },
        error: error => {
          console.log(error);
          this._notifications.error(
            this.translate.instant(
              'PROFILES.NOTIFICATIONS.PROFILE_DELETE_FAILED'
            ),
            this.translate.instant(
              'PROFILES.NOTIFICATIONS.PROFILE_DELETE_FAILED_DESC'
            )
          );
          this.blockUI.stop();
        }
      });
  }

  submitProfile(): void {
    if (this.isEditing) {
      this.updateProfiles();
    } else {
      this.addProfile();
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.profileForm.reset();
    this.selectedRoles = [];
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchProfiles();
  }
}
