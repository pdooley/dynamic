import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-scaffold',
  templateUrl: './scaffold.component.html',
  styleUrls: ['./scaffold.component.scss'],
})
export class ScaffoldComponent {
  @Output() navOpenedChange = new EventEmitter<boolean>();
  @Input() header = { title: 'My App Title' };
  @Input() navOpened = false;
}
