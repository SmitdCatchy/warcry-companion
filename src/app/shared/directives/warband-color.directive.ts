import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Color } from 'src/app/core/enums/color.enum';

@Directive({
  selector: '[warbandColor]'
})
export class WarbandColorDirective implements OnInit, OnDestroy {
  @Input() warbandColor?: Color | string;
  @Input() warbandColorOpaque: boolean;
  @Input() warbandColorAsync?: Observable<Color | string>;
  @Input() set warbandColorImportant(warbandColor: any) {
    this.importantColor = warbandColor;
    if (warbandColor) {
      this.setBackgroundColor(warbandColor);
    } else {
      this.setBackgroundColor(this.syncColor);
    }
  }
  private importantColor?: Color | string;
  private syncColor: Color | string;
  private _subscriptions = new Subscription();

  constructor(private element: ElementRef) {
    this.warbandColor = Color.grey;
    this.syncColor = Color.grey;
    this.warbandColorOpaque = true;
  }

  ngOnInit(): void {
    if (this.warbandColorAsync) {
      this._subscriptions.add(
        this.warbandColorAsync.subscribe((color) => {
          this.syncColor = color;
          if (!this.importantColor) {
            this.setBackgroundColor(color);
          }
        })
      );
    } else if (this.warbandColor) {
      this.setBackgroundColor(this.warbandColor);
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  private setBackgroundColor(color: Color | string): void {
    this.element.nativeElement.style.color = fontColorForBackground(color);
    this.element.nativeElement.style.backgroundColor = this.warbandColorOpaque
      ? `${color}cc`
      : color;
  }
}

export function getLuminance(color: Color | string): number {
  const bgColor = color.substring(1, 7);
  var r = parseInt(bgColor.substring(0, 2), 16);
  var g = parseInt(bgColor.substring(2, 4), 16);
  var b = parseInt(bgColor.substring(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function fontColorForBackground(color: Color | string): string {
  return getLuminance(color) > 125 ? '#000000' : '#ffffff';
}
