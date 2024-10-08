import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { ProfilesService } from 'src/app/admin/services/profiles.service';
import { UserService } from 'src/app/admin/services/user.service';
import { Profile } from 'src/app/admin/utilities/models/profile.model';

@Component({
  selector: 'app-edit-dialog-user',
  templateUrl: './edit-dialog-user.component.html',
  styleUrls: ['./edit-dialog-user.component.scss']
})
export class EditDialogUserComponent {
  editUserForm: FormGroup;
  profiles: Profile[] = [];
  filteredProfiles: MatTableDataSource<Profile> = new MatTableDataSource();

  constructor(
    private readonly userService: UserService,
    private readonly profilesService: ProfilesService,
    private readonly fb: FormBuilder,
    private readonly translate: TranslateService,
    private readonly _notifications: NotificationsService,
    public dialogRef: MatDialogRef<EditDialogUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {
    this.editUserForm = this.fb.group({
      fullName: ['', [Validators.required]],
      profile: ['', [Validators.required]],
    });
    this.translate.use('es');
  }

  ngOnInit(): void {
    this.fetchUserDetails(this.data.userId);
    this.fetchProfiles();
  }

  fetchUserDetails(userId: number): void {
    this.userService.getUserId(userId).subscribe({
      next: response => {
        console.log('Usuario obtenido:', response);
        this.editUserForm.patchValue({
          fullName: response.fullName,
          profile: response.name,
        });
        this.fetchProfiles();
      },
      error: error => {
        console.error(
          this.translate.instant('USERS.ERRORS.FETCH_USER'),
          error
        );
      }
    });
  }

  fetchProfiles(): void {
    this.profilesService.getProfiles().subscribe({
      next: profiles => {
        if (profiles.object) {
          console.log('Perfiles obtenidos:', profiles);
          this.profiles = profiles.object.object;
          this.filteredProfiles = new MatTableDataSource(this.profiles);
        }
      },
      error: error => {
        console.error('Error fetching profiles:', error);
      }
    });
  }

  changeStatus(userId: number): void {
    this.userService.changeStatus(userId).subscribe({
      next: response => {
        this.fetchUserDetails(userId);
        console.log('Usuario actualizado:', response);
        this._notifications.success(
          this.translate.instant('USERS.NOTIFICATIONS.UPDATE_SUCCESS'), ''
        );
        this.dialogRef.close(true)
      },
      error: error => {
        console.error(
          this.translate.instant('USERS.ERRORS.STATUS_TOGGLE'),
          error
        );
        this._notifications.error(this.translate.instant('USERS.NOTIFICATIONS.STATUS_FAILURE'), '');
      }
    });
  }

  saveChanges(): void {
    if (this.editUserForm.valid) {
      const updatedUser = {
        fullName: this.editUserForm.value.fullName,
        profileId: this.editUserForm.value.profile,
        dateOfBirth: new Date(),
      }
      this.userService.putUser(this.data.userId, updatedUser).subscribe({
        next: () => {
          this._notifications.success(this.translate.instant('USERS.NOTIFICATIONS.UPDATE_SUCCESS'), '');
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
