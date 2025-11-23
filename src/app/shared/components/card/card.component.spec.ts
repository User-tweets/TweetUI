import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-card>Test Content</app-card>`,
  imports: [CardComponent],
  standalone: true,
})
class TestHostComponent {}

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should project content', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    const cardElement: HTMLElement = hostFixture.nativeElement.querySelector('app-card');
    expect(cardElement.textContent).toContain('Test Content');
  });
});


