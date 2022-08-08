import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Color } from 'src/app/core/enums/color.enum';

@Directive({
  selector: '[warbandColor]'
})
export class WarbandColorDirective implements OnInit {
  @Input('warbandColor') color?: Color | string;
  @Input('warbandColorOpaque') opaque: boolean;
  @Input('warbandColorAsync') colorAsync?: Observable<Color | string>;

  constructor(private element: ElementRef) {
    this.color = Color.grey;
    this.opaque = true;
  }

  ngOnInit(): void {
    if (this.colorAsync) {
      this.colorAsync.subscribe(color => {
        this.setBackgroundColor(color);
      })
    } else if (this.color) {
      this.setBackgroundColor(this.color);
    }
  }

  private setBackgroundColor(color: Color | string): void {
    this.element.nativeElement.style.backgroundColor = this.opaque ? `${color}cc` : color;
  }
}
