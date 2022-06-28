import { Component, ElementRef, HostBinding, HostListener, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map, withLatestFrom } from 'rxjs';

import { PropertyListener } from '@vsolv/dev-kit/rx';
import { fadeIn } from '@vsolv/ui-kit/animations';

import { MenuLinkPickerLink } from '../../interfaces/menu-link-picker-link';

@Component({
  selector: 'ui-menu-link-picker',
  templateUrl: './menu-link-picker.component.html',
  styleUrls: ['./menu-link-picker.component.scss'],
  animations: [fadeIn('200ms')],
})
export class MenuLinkPickerComponent {
  @Input() color: 'primary' | 'accent' | 'warn' | null = null;
  @Input() actionIcon = 'search';
  @Input() actionCTA = 'Browse All';
  @ViewChild('accordion') accordion?: MatAccordion;
  @Input() links: MenuLinkPickerLink[] = [];

  @HostBinding('class.collapsed')
  @Input()
  collapsed = false;

  @PropertyListener('links')
  links$ = new BehaviorSubject<MenuLinkPickerLink[]>(this.links);

  activeLink$ = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    map(() => this.router.url),
    withLatestFrom(this.links$),
    map(([url, links]) => links.find(l => url.startsWith(l.routerLink || '')))
  );

  opened = false;

  constructor(private router: Router, private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clickout(event: any) {
    // Close any open expansion panel if the view is in collapsed mode and the user clicks away.
    if (!this.elementRef.nativeElement.contains(event.target) && this.collapsed) {
      this.accordion?.closeAll();
    }
  }
}
