import { Component, inject, signal, computed, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user';
import { Router } from '@angular/router';
import { User } from '../../shared/models';

@Component({
  selector: 'app-show-user',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './show-user.html',
  styleUrl: './show-user.css',
})
export class ShowUser implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  // State
  users = signal<User[]>([]);
  searchQuery = signal<string>('');
  currentUser = signal<string>('');

  // Computed
  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allUsers = this.users();
    const current = this.currentUser();

    return allUsers.filter(
      (user) => user.username !== current && user.username.toLowerCase().includes(query),
    );
  });

  ngOnInit() {
    const user = localStorage.getItem('username');
    if (user) {
      this.currentUser.set(user);
      this.loadUsers();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data || []);
      },
      error: (err: unknown) => console.error('Error loading users', err),
    });
  }

  viewProfile(username: string) {
    this.router.navigate(['/show-users/' + username]);
  }
}
