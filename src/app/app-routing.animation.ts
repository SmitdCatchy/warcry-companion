import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const Slider = trigger('routeAnimations', [
  transition('menu => warband', slideTo('right')),
  transition('menu => battle', slideTo('right')),
  transition('menu => battlegrounds', slideTo('right')),
  transition('warband => menu', slideTo('left')),
  transition('warband => battle', slideTo('right')),
  transition('battle => warband', slideTo('left')),
  transition('battle => menu', slideTo('left')),
  transition('battlegrounds => menu', slideTo('left')),
]);

function slideTo(direction: 'left' | 'right'): any {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({[direction]: '-100%'})
    ]),
    group([
      query(':leave', [
        animate('200ms ease-out', style({[direction]: '100%'}))
      ], optional),
      query(':enter', [
        animate('200ms ease-out', style({[direction]: '0%'}))
      ], optional)
    ])
  ];
}
