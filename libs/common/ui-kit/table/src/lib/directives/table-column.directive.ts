import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[vsolvTableCol]',
  exportAs: 'vsolvTableCol',
})
export class TableColumnDirective {
  @Input('vsolvTableCol') id?: string;
  constructor(public templateRef: TemplateRef<TableColumnDirective>) {}
}
