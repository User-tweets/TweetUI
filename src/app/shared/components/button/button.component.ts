import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <ng-container *ngIf="routerLink; else buttonTemplate">
      <a
        [routerLink]="routerLink"
        [ngClass]="getClasses()"
        class="flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer no-underline"
      >
        <ng-content></ng-content>
      </a>
    </ng-container>

    <ng-template #buttonTemplate>
      <button
        [type]="type"
        [disabled]="disabled"
        [ngClass]="getClasses()"
        class="flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
      >
        <ng-content></ng-content>
      </button>
    </ng-template>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth: boolean = false;
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() routerLink: string | any[] | null = null;

  getClasses(): string {
    const classes = [];

    // Size
    switch (this.size) {
      case 'sm': classes.push('px-3 py-1.5 text-sm'); break;
      case 'md': classes.push('px-4 py-2 text-base'); break;
      case 'lg': classes.push('px-6 py-3 text-lg font-bold'); break;
    }

    // Width
    if (this.fullWidth) classes.push('w-full');

    // Variant
    switch (this.variant) {
      case 'primary':
        classes.push('bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 focus-visible:ring-indigo-500');
        break;
      case 'secondary':
        classes.push('bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-400');
        break;
      case 'ghost':
        classes.push('bg-transparent text-slate-600 hover:bg-slate-100 hover:text-indigo-600');
        break;
      case 'danger':
        classes.push('bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200 focus-visible:ring-rose-500');
        break;
    }

    // Rounded
    classes.push('rounded-xl');

    return classes.join(' ');
  }
}
