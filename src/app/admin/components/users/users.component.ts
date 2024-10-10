import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';
import { User, Users } from '../../utilities/models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProfilesService } from '../../services/profiles.service';
import { Profile } from '../../utilities/models/profile.model';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  @BlockUI() blockUI!: NgBlockUI;
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  }

  users: User[] = [];
  profiles: Profile[] = [];
  filteredUsers: MatTableDataSource<User> = new MatTableDataSource();
  filteredProfiles: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchQuery = '';
  pageSize = 10;
  currentPage = 0;
  totalUsers = 0;
  isEditing: boolean = false;
  selectedUserId!: number;
  userStatus!: boolean;

  constructor(
    private readonly _notifications: NotificationsService,
    private readonly translate: TranslateService,
    private readonly userService: UserService,
    private readonly profilesService: ProfilesService,
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required]],
      profile: ['', [Validators.required]],
      profiles: ['', []],
    });
    this.translate.use('es');
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchProfiles();
  }

  fetchUserDetails(userId: number): void {
    this.userService.getUserId(userId).subscribe({
      next: response => {
        console.log('Usuario obtenido:', response);
        this.selectedUserId = response.userId;
        this.userForm.patchValue({
          email: response.email,
          fullName: response.fullName,
          profile: response.profileId,
          status: response.status,
        });
        this.userForm.get('email')?.disable();
        this.userStatus = response.status;
        this.fetchProfiles();
        this.isEditing = true;
        this.userForm.markAsPristine();
      },
      error: error => {
        console.error(
          this.translate.instant('USERS.ERRORS.FETCH_USER'),
          error
        );
      }
    });
  }

  fetchUsers(): void {
    this.blockUI.start();
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: users => {
        if (users.object) {
          console.log('Users loaded:', users);
          this.users = users.object;
          this.filteredUsers = new MatTableDataSource(this.users);
          this.currentPage = users.currentPage;
          this.totalUsers = users.totalElements;
        }
        this.blockUI.stop();
      },
      error: error => {
        console.error('Error fetching users:', error);
        this.blockUI.stop();
      }
    })
  }

  fetchProfiles(): void {
    this.blockUI.start();
    this.profilesService.getProfiles().subscribe({
      next: profiles => {
        if (profiles.object) {
          this.profiles = profiles.object.object;
          this.filteredProfiles = this.profiles;
        }
        this.blockUI.stop();
      },
      error: error => {
        console.error('Error fetching profiles:', error);
        this.blockUI.stop();
      }
    });
  }

  updateUser(): void {
    if (this.userForm.valid) {
      const updatedUser = {
        fullName: this.userForm.value.fullName,
        profileId: this.userForm.value.profile,
        dateOfBirth: new Date(),
      }
      this.userService.putUser(this.selectedUserId, updatedUser).subscribe({
        next: () => {
          this._notifications.success(this.translate.instant('USERS.NOTIFICATIONS.UPDATE_SUCCESS'), '');
          this.fetchUsers();
          this.userForm.reset();
        }
      });

    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.userForm.get('email')?.enable();
    this.userForm.reset();
  }

  addUser(): void {
    if (this.userForm.valid) {
      const userData = {
        email: this.userForm.value.email,
        fullName: this.userForm.value.fullName,
        profileId: this.userForm.value.profile,
        dateOfBirth: new Date(),
      };
      this.blockUI.start(
        this.translate.instant('USERS.NOTIFICFATIONS.CREATING_USER'),
      );

      this.userService.addUser(userData).subscribe({
        next: response => {
          console.log('User created:', response);
          this._notifications.success(
            this.translate.instant('USERS.NOTIFICATIONS.USER_CREATED'),
            this.translate.instant('USERS.NOTIFICATIONS.USER_CREATED_DESC')
          );
          this.fetchUsers();
          this.fetchProfiles();
          this.userForm.reset();
          this.blockUI.stop();
          this.isEditing = false;
        },
        error: error => {
          console.error('Error creating user:', error);
          console.error('Error creating user:', userData);
          this._notifications.error(
            this.translate.instant('USERS.NOTIFICATIONS.USER_CREATION_FAILURE'),
            this.translate.instant('USERS.NOTIFICATIONS.USER_CREATION_FAILURE_DESC')
          );
          this.blockUI.stop();
        }
      });
    } else {
      this._notifications.error(
        this.translate.instant('USERS.NOTIFICATIONS.INVALID_FORM'),
        this.translate.instant('USERS.NOTIFICATIONS.INVALID_FORM_DESC')
      )
    }
  }

  changeStatus(userId: number): void {
    this.userService.changeStatus(userId).subscribe({
      next: response => {
        this.fetchUserDetails(userId);
        console.log('Usuario actualizado:', response);
        this._notifications.success(
          this.translate.instant('USERS.NOTIFICATIONS.UPDATE_SUCCESS'), ''
        );
        this.fetchUsers();
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

  submitUser(): void {
    if (this.isEditing) {
      this.updateUser();
    } else {
      this.addUser();
    }
  }

  searchUser(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchQuery = filterValue.trim().toLowerCase();
    this.filteredUsers.filter = this.searchQuery;
    if (this.filteredUsers.paginator) {
      this.filteredUsers.paginator.firstPage();
    }
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchUsers();
  }
}
