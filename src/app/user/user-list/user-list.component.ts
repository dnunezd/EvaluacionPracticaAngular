import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => { this.users = users; },
      error: () => {}
    });
  }

  selectUser(user: User): void {
    if (this.selectedUser?.id !== user.id) {
      this.selectedUser = user;
    }
  }

  closeDetail(): void {
    this.selectedUser = null;
  }
}
