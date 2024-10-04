import { Component, OnInit } from '@angular/core';
import { ListUserService } from 'src/app/admin/services/list-user.service';
import { UserIdService } from 'src/app/admin/services/user-id.service';

export interface Section {
  email: string;
  fullName: string;
}

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  users: Section[] = [];

  filteredUsers: Section[] = [];
  pageSize = 10;
  currentPage = 0;
  totalUsers = 0;

  showButtons: boolean = false;

  constructor(private listUserService: ListUserService, private userService: UserIdService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.listUserService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Usuarios cargados:', response);
        this.users = response.object;
        this.filteredUsers = [...this.users];
        this.totalUsers = response.totalElements;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredUsers = this.users.filter(user =>
      user.email.toLowerCase().includes(filterValue) || user.fullName.toLowerCase().includes(filterValue)
    )
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadUsers();
  }

}
