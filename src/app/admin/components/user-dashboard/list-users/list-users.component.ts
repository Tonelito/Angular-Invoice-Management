import { Component, OnInit } from '@angular/core';
import { ListUserService } from 'src/app/admin/services/list-user.service';

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
  paginatedUsers: Section[] = [];
  pageSize = 10;
  currentPage = 0;

  constructor(private listUserService: ListUserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.listUserService.getUsers().subscribe({
      next: (response) => {
        this.users = response.object;
        this.filteredUsers = [...this.users];
        this.updatePaginatedUsers();
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
    );
    this.currentPage = 0;
    this.updatePaginatedUsers();
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }
}
