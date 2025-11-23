import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="space-y-1">
      @if (label) {
        <label [for]="inputId" class="mb-1 ml-1 block text-sm font-medium text-slate-700">{{
          label
        }}</label>
      }
      <div class="group relative">
        <!-- Input -->
        <input
          [id]="inputId"
          [type]="inputType"
          [placeholder]="placeholder"
          [formControl]="control"
          (blur)="onTouched()"
          class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 outline-none group-hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          [ngClass]="{
            'pl-10': icon,
            'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10': hasError(),
          }"
          />
    
        <!-- Leading Icon -->
        @if (icon) {
          <mat-icon
            class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xl text-slate-400 transition-colors group-focus-within:text-indigo-500"
            [ngClass]="{ 'text-rose-500 group-focus-within:text-rose-500': hasError() }"
            >
            {{ icon }}
          </mat-icon>
        }
    
        <!-- Password Toggle -->
        @if (type === 'password') {
          <button
            type="button"
            (click)="togglePassword()"
            class="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
            >
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        }
      </div>
    
      <!-- Error Message -->
      @if (hasError()) {
        <div
          class="animate-slideIn ml-1 flex items-center gap-1 text-xs font-medium text-rose-500"
          >
          <mat-icon class="flex h-[14px] w-[14px] items-center justify-center text-[14px]"
            >error</mat-icon
            >
            <span>{{ errorMessage }}</span>
          </div>
        }
      </div>
    `,
  styles: [
    `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-slideIn {
        animation: slideIn 0.2s ease-out;
      }
      :host {
        display: block;
      }
    `,
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() icon = '';
  @Input() control: FormControl = new FormControl();
  @Input() errorMessage = '';

  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  hidePassword = true;

  get inputType(): string {
    if (this.type === 'password') {
      return this.hidePassword ? 'password' : 'text';
    }
    return this.type;
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  hasError(): boolean {
    return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  // ControlValueAccessor stubs (handled by passing the FormControl directly usually, but good to have)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  writeValue(_value: any): void {
    // Implemented as part of ControlValueAccessor
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  registerOnChange(_fn: any): void {
    // Implemented as part of ControlValueAccessor
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  onTouched: () => void = () => {
    // Implemented as part of ControlValueAccessor
  };
}
