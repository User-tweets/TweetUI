import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [
    NgxSpinnerComponent,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
    MatIconModule,
  ],
  templateUrl: './forgot.html',
  styleUrl: './forgot.css',
})
export class Forgot {
  private authService = inject(AuthService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);

  hide = true;
  hide2 = true;
  hide3 = true;

  credentials = new FormGroup({
    userId: new FormControl('', [Validators.required, Validators.email]),
    number: new FormControl('', [
      Validators.required,
      Validators.min(1000000000),
      Validators.max(9999999999),
    ]),
    old_password: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
    ]),
  });

  public get userId() {
    return this.credentials.get('userId') as FormControl;
  }
  public get number() {
    return this.credentials.get('number') as FormControl;
  }
  public get old_password() {
    return this.credentials.get('old_password') as FormControl;
  }
  public get password() {
    return this.credentials.get('password') as FormControl;
  }
  public get confirmPassword() {
    return this.credentials.get('confirmPassword') as FormControl;
  }

  onSubmit() {
    if (this.credentials.value.password != this.credentials.value.confirmPassword) {
      alert('password mismatch');
    } else {
      this.spinner.show();
      this.authService
        .forgotPassword(
          this.credentials.value.userId!,
          this.credentials.value.old_password!,
          this.credentials.value.password!,
        )
        .subscribe({
          next: () => {
            alert('password changed!');
            this.spinner.hide();
            this.router.navigate(['/']);
          },
          error: (error: unknown) => {
            this.spinner.hide();
            alert('You entered wrong password. TRY AGAIN!');
            console.error(error);
          },
        });
    }
  }

  passwordMismatch(): boolean {
    if (this.credentials.value.password != this.credentials.value.confirmPassword) {
      return true;
    }
    return false;
  }
}
