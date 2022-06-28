import { animate, style, transition, trigger } from '@angular/animations';

export const fadeIn = (duration = '600ms') =>
  trigger('fadeIn', [
    transition('void => *', [style({ opacity: 0 }), animate(duration + ' ease', style({ opacity: 1 }))]),
  ]);

export const fadeInOut = trigger('fadeInOut', [
  transition('void => *', [style({ opacity: 0 }), animate('600ms ease', style({ opacity: 1 }))]),
  transition('* => void', [animate('600ms ease', style({ opacity: 0 }))]),
]);
