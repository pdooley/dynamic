import { ResponsiveSidenavComponent } from './responsive-sidenav.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ResponsiveSidenavComponent', () => {
  let component: ResponsiveSidenavComponent;
  let fixture: ComponentFixture<ResponsiveSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsiveSidenavComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
