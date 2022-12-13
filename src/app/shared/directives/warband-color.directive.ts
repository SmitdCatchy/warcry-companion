import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Color } from 'src/app/core/enums/color.enum';

@Directive({
  selector: '[warbandColor]'
})
export class WarbandColorDirective implements OnInit, OnDestroy {
  @Input('warbandColor') color?: Color | string;
  @Input('warbandColorOpaque') opaque: boolean;
  @Input('warbandColorAsync') colorAsync?: Observable<Color | string>;
  @Input('warbandColorImportant') set important(color: any) {
    this.importantColor = color;
    if (color) {
      this.setBackgroundColor(color);
    } else {
      this.setBackgroundColor(this.syncColor);
    }
  }
  private importantColor?: Color | string;
  private syncColor: Color | string;
  private _subscriptions = new Subscription();

  constructor(private element: ElementRef) {
    this.color = Color.grey;
    this.syncColor = Color.grey;
    this.opaque = true;
  }

  ngOnInit(): void {
    if (this.colorAsync) {
      this._subscriptions.add(
        this.colorAsync.subscribe((color) => {
          this.syncColor = color;
          if (!this.importantColor) {
            this.setBackgroundColor(color);
          }
        })
      );
    } else if (this.color) {
      this.setBackgroundColor(this.color);
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  private setBackgroundColor(color: Color | string): void {
    const bgColor = color.substring(1, 7)
    var r = parseInt(bgColor.substring(0, 2), 16);
    var g = parseInt(bgColor.substring(2, 4), 16);
    var b = parseInt(bgColor.substring(4, 6), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    this.element.nativeElement.style.color = luminance > 125 ? '#000000' : '#ffffff';;
    this.element.nativeElement.style.backgroundColor = this.opaque
      ? `${color}cc`
      : color;
  }
}
