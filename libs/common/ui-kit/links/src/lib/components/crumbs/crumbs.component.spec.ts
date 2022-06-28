import { CrumbsComponent } from './crumbs.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('CrumbsComponent', () => {
  let component: CrumbsComponent;
  let fixture: ComponentFixture<CrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrumbsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
