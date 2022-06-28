import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'ui-responsive-sidenav',
  templateUrl: './responsive-sidenav.component.html',
  styleUrls: ['./responsive-sidenav.component.scss'],
})
export class ResponsiveSidenavComponent {
  @Output() openedChange = new EventEmitter<boolean>();
  @Input() opened = false;

  mode$: Observable<MatDrawerMode> = this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait])
    .pipe(map(state => (state.matches ? 'over' : 'side')));

  constructor(private breakpointObserver: BreakpointObserver) {}
}
