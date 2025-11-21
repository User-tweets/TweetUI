import { Component, OnInit } from '@angular/core';
import { Login_service } from '../../services/login_service';
import { Router, RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private loginService: Login_service, private router: Router) { }

  ngOnInit() {
    // Subscribe to login state changes
    this.loginService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  logoutUser() {
    this.loginService.logout();
    this.router.navigate(['/']);
  }
}
