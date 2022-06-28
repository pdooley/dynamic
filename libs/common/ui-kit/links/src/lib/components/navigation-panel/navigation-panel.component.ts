import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

import { fadeIn } from '@vsolv/ui-kit/animations';

import { NavigationPanelLink } from '../../interfaces/navigation-panel-link';

@Component({
  selector: 'ui-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.scss'],
  animations: [fadeIn('200ms')],
})
export class NavigationPanelComponent {
  @Input() color: 'primary' | 'accent' | 'warn' | null = null;

  @Input() links: NavigationPanelLink[] = [];
  opened = this.links.map(() => false);

  @HostBinding('class.collapsed')
  @Input()
  collapsed = false;

  @ViewChild('accordion') accordion?: MatAccordion;
  @ViewChild('panel', { read: ElementRef }) panelRef?: ElementRef;
  @ViewChildren('childLinkOverlay') childLinks?: QueryList<CdkConnectedOverlay>;

  step: number | null = null;
  expanded = false;

  activeUrl$ = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    map(() => this.router.url)
  );

  constructor(private router: Router, private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clickout(event: any) {
    // Close any open expansion panel if the view is in collapsed mode and the user clicks away.
    if (!this.elementRef.nativeElement.contains(event.target) && this.collapsed) {
      this.accordion?.closeAll();
    }
  }

  navigateExternal(link?: string | null) {
    if (link) window.open(link, '_blank');
  }
}
