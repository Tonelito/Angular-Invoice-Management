import { Component } from '@angular/core';


export interface Section {
  email: string;
  username: string;
}

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {
  users: Section[] = [
    {
      email: 'uriel@gmail.com', username: 'uriel',
    },
    {
      email: 'galicia@gmail.com', username: 'galicia',
    },
    {
      email: 'douglas@gmial.com', username: 'douglas',
    },
    {
      email: 'uriel@gmail.com', username: 'uriel',
    },
    {
      email: 'galicia@gmail.com', username: 'galicia',
    },
    {
      email: 'douglas@gmial.com', username: 'douglas',
    },
    {
      email: 'uriel@gmail.com', username: 'uriel',
    },
    {
      email: 'galicia@gmail.com', username: 'galicia',
    },
    {
      email: 'douglas@gmial.com', username: 'douglas',
    },
    {
      email: 'uriel@gmail.com', username: 'uriel',
    },
  ];
}
