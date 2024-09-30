import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProfilesService } from '../../services/profiles.service';
import { RolesService } from '../../services/roles.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ProfileRoleDetailsService } from '../../services/profile-role-details.service';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../utilities/confirmDialog.component';

interface Profile {
  profileId: number;
  name: string;
  description: string;
  status: boolean;
}

interface Role {
  roleId: number;
  name: string;
  description: string;
  status: boolean;
}

/* Error matcher for material inputs */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  profileForm: FormGroup;
  @BlockUI() blockUI!: NgBlockUI;
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  profiles: Profile[] = [];
  filteredProfiles: MatTableDataSource<Profile> = new MatTableDataSource();
  roles: Role[] = [];
  searchQuery = '';

  constructor(
    private _notifications: NotificationsService,
    private translate: TranslateService,
    private profilesService: ProfilesService,
    private profileRoleDetailsService: ProfileRoleDetailsService,
    private rolesService: RolesService,
    private fb: FormBuilder,
    private dialog: MatDialog
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
      next: data => {
        if (data.object) {
          this.profiles = data.object;
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
    this.rolesService.getRoles().subscribe({
      next: data => {
        if (data.object) {
          this.roles = data.object;
        }
        this.blockUI.stop();
      },
      error: error => {
        console.error('Error fetching roles', error);
        this.blockUI.stop();
      }
    });
  }

  postProfile() {
    if (this.profileForm.valid) {
      const profileData = {
        name: this.profileForm.value.name,
        description: this.profileForm.value.description
      };
      this.blockUI.start(
        this.translate.instant('PROFILES.NOTIFICATIONS.CREATING_PROFILE')
      );

      this.profilesService.postProfile(profileData).subscribe({
        next: (response: any) => {
          this._notifications.success(
            this.translate.instant('PROFILES.NOTIFICATIONS.PROFILE_CREATED'),
            this.translate.instant(
              'PROFILES.NOTIFICATIONS.PROFILE_CREATED_DESC'
            )
          );
          this.fetchProfiles();
          this.blockUI.stop();
        },
        error: error => {
          this._notifications.error(
            this.translate.instant(
              'PROFILES.NOTIFICATIONS.PROFILE_CREATION_FAILURE'
            ),
            this.translate.instant(
              'PROFILES.NOTIFICAITONS.PROFILE_CREATION_FAILURE_DESC'
            )
          );
          console.log(error);
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

  confirmDeleteProfile(profile: Profile): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
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

    this.profilesService.deleteProfile(profileId).subscribe({
      next: () => {
        this._notifications.success(
          this.translate.instant('PROFILES.NOTIFICATIONS.PROFILE_DELETED'),
          this.translate.instant('PROFILES.NOTIFICATIONS.PROFILE_DELETED_DESC')
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
