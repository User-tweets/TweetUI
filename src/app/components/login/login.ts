import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login_service, Credentials } from '../../services/login_service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { MatIcon } from '@angular/material/icon';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerComponent,
    ReactiveFormsModule,
    RouterLink,
    MatIcon,
    ButtonComponent,
    InputComponent,
    CardComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(
    private loginService: Login_service,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  hide: boolean = true;
  credentials = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
    ]),
  });

  public get username() {
    return this.credentials.get('username') as FormControl;
  }
  public get password() {
    return this.credentials.get('password') as FormControl;
  }

  onSubmit(): void {
    this.spinner.show();

    const credentials: Credentials = {
      username: this.credentials.value.username || '',
      password: this.credentials.value.password || ''
    };

    this.loginService.getToken(credentials).subscribe({
      next: (response: any) => {
        localStorage.setItem('username', credentials.username);
        localStorage.setItem('token', response.token);
        this.spinner.hide();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error(error);
        this.spinner.hide();
        alert('Invalid credentials');
      }
    });
  }
}
