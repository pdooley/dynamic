import { Component, HostBinding, Input } from '@angular/core';

import { CrumbLink } from '@vsolv/ui-kit/links';

import { View, ViewService } from '../../services';

@Component({
  selector: 'ui-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  @Input()
  @HostBinding('class')
  get view() {
    return this._view ?? this.viewService.view$.value;
  }
  set view(value: View) {
    this._view = value;
  }
  private _view: View | null = null;

  @Input() header: {
    title: string;
    subtitle?: string;
    crumbs: CrumbLink[];
  } = { title: 'My Page', crumbs: [] };

  constructor(private viewService: ViewService) {}
}
