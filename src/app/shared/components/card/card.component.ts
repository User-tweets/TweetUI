import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  // Apply classes directly on the host so the same element
  // has both border-radius and box-shadow (and receives any user classes).
  // Use [class] instead of [ngClass] to avoid requiring NgClass in every consumer.
  host: { '[class]': 'getClasses()' },
  template: ` <ng-content></ng-content> `,
})
export class CardComponent {
  @Input() variant: 'default' | 'glass' = 'default';
  @Input() padding = 'p-6';

  getClasses(): string {
    // Ensure the host is positioned for any absolute children and that
    // border-radius + shadow live on the same element
    const classes = ['relative', this.padding];

    if (this.variant === 'glass') {
      classes.push(
        'bg-white/80 backdrop-blur-xl bg-clip-padding border border-white/20 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
      );
    } else {
      classes.push(
        'bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.08)]',
      );
    }

    return classes.join(' ');
  }
}
