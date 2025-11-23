import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RegisterCredentials } from '../../shared/models';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgxSpinnerComponent,
    ReactiveFormsModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
    MatIconModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);

  hide = true;

  credentials = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
    ]),
    number: new FormControl('', [
      Validators.required,
      Validators.min(1000000000),
      Validators.max(9999999999),
    ]),
  });

  public get firstName() {
    return this.credentials.get('firstName') as FormControl;
  }
  public get lastName() {
    return this.credentials.get('lastName') as FormControl;
  }
  public get username() {
    return this.credentials.get('username') as FormControl;
  }
  public get password() {
    return this.credentials.get('password') as FormControl;
  }
  public get number() {
    return this.credentials.get('number') as FormControl;
  }

  onSubmit() {
    this.spinner.show();
    if (this.credentials.valid) {
      const formValue = this.credentials.value;
      const registerData: RegisterCredentials = {
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        username: formValue.username!,
        password: formValue.password!,
        contactNumber: formValue.number!,
      };
      this.authService.registerUser(registerData).subscribe(
        () => {
          this.spinner.hide();
          this.router.navigate(['/']);
        },
        (error: unknown) => {
          console.error(error);
          this.spinner.hide();
        },
      );
    }
  }
}
