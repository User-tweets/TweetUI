import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconButton, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn;

  logoutUser() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
