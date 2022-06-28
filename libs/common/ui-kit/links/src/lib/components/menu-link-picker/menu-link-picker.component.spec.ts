import { MenuLinkPickerComponent } from './menu-link-picker.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('MenuLinkPickerComponent', () => {
  let component: MenuLinkPickerComponent;
  let fixture: ComponentFixture<MenuLinkPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuLinkPickerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLinkPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
