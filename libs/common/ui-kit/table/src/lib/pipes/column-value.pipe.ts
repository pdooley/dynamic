/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { isObservable, map, Observable } from 'rxjs';

import { TableColumn } from '../model/column-types';

@Pipe({ name: 'colValue' })
export class ColValuePipe implements PipeTransform {
  transform<T>(
    columnConfig: TableColumn<T>,
    item: any,
    arrayify: boolean = true
  ): Promise<any | any[]> | Observable<any | any[]> {
    const config = (columnConfig as any)[columnConfig.type];

    let value = null;
    if (typeof config === 'function') value = config(item);
    else if (config) value = config;

    if (isObservable(value)) {
      return value.pipe(map(v => (Array.isArray(v) || !arrayify ? v : [v])));
    } else {
      return Promise.resolve(value).then(res => (Array.isArray(res) || !arrayify ? res : [res]));
    }
  }
}
