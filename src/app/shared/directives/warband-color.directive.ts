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
  private subscriptions = new Subscription();

  constructor(private element: ElementRef) {
    this.color = Color.grey;
    this.syncColor = Color.grey;
    this.opaque = true;
  }

  ngOnInit(): void {
    if (this.colorAsync) {
      this.subscriptions.add(
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
    this.subscriptions.unsubscribe();
  }

  private setBackgroundColor(color: Color | string): void {
    this.element.nativeElement.style.backgroundColor = this.opaque
      ? `${color}cc`
      : color;
  }
}
