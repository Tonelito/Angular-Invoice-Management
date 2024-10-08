import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProfilesService } from '../../services/profiles.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog } from '@angular/material/dialog';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';
import {
  CreateProfile,
  Profile,
  Role
} from '../../utilities/models/profile.model';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  profileForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  @BlockUI() blockUI!: NgBlockUI;
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

  profiles: Profile[] = [];
  roles: Role[] = [];
  filteredProfiles: MatTableDataSource<Profile> = new MatTableDataSource();
  selectedRoles: number[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchQuery = '';

  constructor(
    private readonly _notifications: NotificationsService,
    private readonly translate: TranslateService,
    private readonly profilesService: ProfilesService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
    this.translate.use('es');
  }

  ngOnInit(): void {
    this.fetchProfiles();
    this.fetchRoles();
  }

  fetchProfiles(): void {
    this.blockUI.start();
    this.profilesService.getProfiles().subscribe({
      next: profiles => {
        if (profiles.object) {
          this.profiles = profiles.object.object;
          this.filteredProfiles = new MatTableDataSource(this.profiles);
          this.filteredProfiles.paginator = this.paginator;
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

  toggleRole(roleId: number, checked: boolean): void {
    if (checked) {
      this.selectedRoles.push(roleId);
    } else {
      this.selectedRoles = this.selectedRoles.filter(id => id !== roleId);
    }
  }

  submitProfile(): void {
    if (this.profileForm.valid) {
      const profileData: CreateProfile = {
        name: this.profileForm.value.name,
        description: this.profileForm.value.description,
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

  openEditDialog(profile: Profile): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { profileId: profile.profileId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchProfiles();
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

  searchProfiles(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchQuery = filterValue.trim().toLowerCase();
    this.filteredProfiles.filter = this.searchQuery;

    if (this.filteredProfiles.paginator) {
      this.filteredProfiles.paginator.firstPage();
    }
  }
}
