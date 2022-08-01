import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Color } from 'src/app/core/enums/color.enum';
import { Theme } from 'src/app/core/enums/theme.enum';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'smitd-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent {
  warbands = [0,1,2]
  public Theme = Theme;
  public Color = Color;
  public ColorList = Object.keys(Color).map((key) => ({
    key,
    value: Color[key as keyof typeof Color]
  }));
  constructor(public core: CoreService) {}

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.warbands, event.previousIndex, event.currentIndex);
  }
}
