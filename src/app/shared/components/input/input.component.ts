import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';
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
            multi: true
        }
    ],
    template: `
    <div class="space-y-1">
      <label *ngIf="label" class="block text-sm font-medium text-slate-700 mb-1 ml-1">{{ label }}</label>
      <div class="relative group">
        <!-- Input -->
        <input
          [type]="inputType"
          [placeholder]="placeholder"
          [formControl]="control"
          (blur)="onTouched()"
          class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none group-hover:border-slate-300"
          [ngClass]="{'pl-10': icon, 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10': hasError()}"
        />

        <!-- Leading Icon -->
        <mat-icon *ngIf="icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none transition-colors group-focus-within:text-indigo-500" [ngClass]="{'text-rose-500 group-focus-within:text-rose-500': hasError()}">
          {{ icon }}
        </mat-icon>

        <!-- Password Toggle -->
        <button
          *ngIf="type === 'password'"
          type="button"
          (click)="togglePassword()"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
        >
          <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
      </div>

      <!-- Error Message -->
      <div *ngIf="hasError()" class="flex items-center gap-1 ml-1 text-xs text-rose-500 font-medium animate-slideIn">
        <mat-icon class="text-[14px] w-[14px] h-[14px] flex items-center justify-center">error</mat-icon>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
    styles: [`
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slideIn {
      animation: slideIn 0.2s ease-out;
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() type: 'text' | 'password' | 'email' = 'text';
    @Input() icon: string = '';
    @Input() control: FormControl = new FormControl();
    @Input() errorMessage: string = '';

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
    writeValue(value: any): void { }
    registerOnChange(fn: any): void { }
    registerOnTouched(fn: any): void { this.onTouched = fn; }
    onTouched: () => void = () => { };
}
