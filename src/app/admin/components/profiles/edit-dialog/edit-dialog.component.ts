import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfilesService } from '../../../services/profiles.service';
import {
  ProfileWithRoles,
  Role
} from '../../../utilities/models/profile.model';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  editProfileForm: FormGroup;
  profile!: ProfileWithRoles;
  roles: Role[] = [];
  selectedRoles: number[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly profilesService: ProfilesService,
    private readonly _notifications: NotificationsService,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { profileId: number }
  ) {
    this.editProfileForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchProfileDetails(this.data.profileId);
    this.fetchRoles();
  }

  fetchProfileDetails(profileId: number): void {
    this.profilesService.getProfile(profileId).subscribe({
      next: response => {
        this.profile = response.object;
        this.editProfileForm.patchValue({
          name: this.profile.name,
          description: this.profile.description
        });
        this.selectedRoles = this.profile.rolsId.map(role => role.rolId);
      },
      error: error => {
        console.error('Error fetching profile details', error);
      }
    });
  }

  fetchRoles(): void {
    this.profilesService.getRoles().subscribe({
      next: roles => {
        this.roles = roles.object;
      },
      error: error => {
        console.error('Error fetching roles', error);
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

  saveChanges(): void {
    if (this.editProfileForm.valid) {
      const updatedProfile = {
        name: this.editProfileForm.value.name,
        description: this.editProfileForm.value.description,
        rolsId: this.selectedRoles
      };

      this.profilesService
        .putProfile(this.data.profileId, updatedProfile)
        .subscribe({
          next: () => {
            this._notifications.success('Profile updated successfully', '');
            this.dialogRef.close(true);
          },
          error: error => {
            console.error('Error updating profile', error);
            this._notifications.error('Failed to update profile', '');
          }
        });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
