import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'smitd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HeaderComponent {
  constructor(public core: CoreService) {}

  get fontColor(): Observable<string> {
    return this.core.color.pipe(
      map((color) => {
        const bgColor = color.substring(1, 7);
        var r = parseInt(bgColor.substring(0, 2), 16);
        var g = parseInt(bgColor.substring(2, 4), 16);
        var b = parseInt(bgColor.substring(4, 6), 16);
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const fontColor = luminance > 125 ? '#000000' : '#ffffff';
        return fontColor;
      })
    );
  }
}
