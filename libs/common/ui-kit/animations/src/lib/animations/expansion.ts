import { animate, state, style, transition, trigger } from '@angular/animations';

export const heightExpansion = trigger('heightExpansion', [
  state(
    'collapsed, void',
    style({
      height: '0px',
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: 0,
      marginBottom: 0,
      opacity: 0,
      visibility: 'hidden',
    })
  ),
  state('expanded', style({ height: '*', opacity: 1, visibility: 'visible' })),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
]);

export const widthExpansion = trigger('widthExpansion', [
  state(
    'collapsed, void',
    style({
      width: '0px',
      border: 'none',
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 0,
      marginRight: 0,
      opacity: 0,
      visibility: 'hidden',
    })
  ),
  state('expanded', style({ width: '*', border: '*', opacity: 1, visibility: 'visible' })),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
]);
