import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type View = 'default' | 'compact';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  view$ = new BehaviorSubject<View>('default');
}
