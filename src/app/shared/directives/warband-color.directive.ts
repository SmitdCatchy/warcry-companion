import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Color } from 'src/app/core/enums/color.enum';

@Directive({
  selector: '[warbandColor]'
})
export class WarbandColorDirective implements OnInit {
  @Input('warbandColor') color!: Color;
  @Input('warbandColorOpaque') opaque: boolean;

  constructor(private element: ElementRef) {
    this.color = Color.grey;
    this.opaque = true;
  }

  ngOnInit(): void {
    this.element.nativeElement.style.backgroundColor = this.opaque ? `${this.color}cc` : this.color;
  }
}
