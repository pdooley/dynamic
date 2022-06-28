import { Component, Input } from '@angular/core';

import { CrumbLink } from '../../interfaces/crumb-link';

@Component({
  selector: 'ui-crumbs',
  templateUrl: './crumbs.component.html',
  styleUrls: ['./crumbs.component.scss'],
})
export class CrumbsComponent {
  @Input() links: CrumbLink[] = [];
}
