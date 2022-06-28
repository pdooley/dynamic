import { Pipe, PipeTransform, QueryList } from '@angular/core';

import { TableColumnDirective } from '../directives/table-column.directive';

@Pipe({ name: 'templateById' })
export class TemplateByIdPipe implements PipeTransform {
  transform(columns: QueryList<TableColumnDirective>, id: string) {
    return columns.find(c => c.id === id)?.templateRef;
  }
}
