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
import { EditDialogUserComponent } from './edit-dialog-user/edit-dialog-user.component';

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
  filteredProfiles: MatTableDataSource<Profile> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchQuery = '';
  pageSize = 10;
  currentPage = 0;
  totalUsers = 0;
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
    });
    this.translate.use('es');
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchProfiles();
  }

  fetchUsers(): void {
    this.blockUI.start();
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: users => {
        if (users.object) {
          console.log('Users loaded:', users);
          this.users = users.object;
          this.filteredUsers = new MatTableDataSource(this.users);
          this.totalUsers = users.totalElements;
          this.filteredUsers.paginator = this.paginator;
        }
        this.blockUI.stop();
      },
      error: error => {
        console.error('Error fetching users:', error);
        this.blockUI.stop();
      }
    })
  }

  submitUser(): void {
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
          this._notifications.success(
            this.translate.instant('USERS.NOTIFICATIONS.USER_CREATED'),
            this.translate.instant('USERS.NOTIFICATIONS.USER_CREATED_DESC')
          );
          this.fetchUsers();
          this.fetchProfiles();
          this.userForm.reset();
          this.blockUI.stop();
        },
        error: error => {
          console.error('Error creating user:', error);
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

  fetchProfiles(): void {
    this.blockUI.start();
    this.profilesService.getProfiles().subscribe({
      next: profiles => {
        if (profiles.object) {
          this.profiles = profiles.object.object;
          this.filteredProfiles = new MatTableDataSource(this.profiles);
        }
        this.blockUI.stop();
      },
      error: error => {
        console.error('Error fetching profiles:', error);
        this.blockUI.stop();
      }
    });
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

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(EditDialogUserComponent, {
      data: { userId: user.userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchUsers();
      }
    });
  }
}
