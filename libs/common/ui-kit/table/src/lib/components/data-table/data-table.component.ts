import {
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { TableColumnDirective } from '../../directives/table-column.directive';
import { TableColumn } from '../../model/column-types';
import { TableDataSource } from '../../model/datasource';

@Component({
  selector: 'ui-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T> implements AfterViewInit {
  @HostBinding('class')
  @Input()
  view: 'default' | 'compact' = 'default';
  @Input() dataSource!: TableDataSource<T>;
  @Input() @HostBinding('class.highlight') clickableRows = true;
  @Output() rowClick = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<T>;

  rippleDisabled = false;

  @ContentChildren(TableColumnDirective)
  colTemplates!: QueryList<TableColumnDirective>;

  constructor(private snackbar: MatSnackBar) {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  copied() {
    this.snackbar.open('Value copied to clipboard!', 'OK', {
      duration: 1500,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cellClicked(col: TableColumn<T>, row: T, event: any) {
    event.stopImmediatePropagation();
    col.click?.(row, event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowClicked(row: T, ripple?: MatRipple, event?: any) {
    console.log(event);
    ripple?.launch(event?.clientX || 0, event?.clientY || 0);
    this.rowClick.emit(row);
  }
}
