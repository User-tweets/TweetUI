import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the correct label', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    const labelElement: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    expect(labelElement.textContent).toContain('Test Label');
  });

  it('should have the correct input type', () => {
    component.type = 'password';
    fixture.detectChanges();
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.type).toBe('password');
  });

  it('should display placeholder', () => {
    component.placeholder = 'Enter text';
    fixture.detectChanges();
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.placeholder).toBe('Enter text');
  });
});


