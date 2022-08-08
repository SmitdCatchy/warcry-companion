import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Language } from 'src/app/core/enums/language.enum';
import { Theme } from 'src/app/core/enums/theme.enum';
import { Warband } from 'src/app/core/models/warband.model';
import { BattleService } from 'src/app/core/services/battle.service';
import { CoreService } from 'src/app/core/services/core.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { WarbandService } from 'src/app/core/services/warband.service';
import { WarbandDialogComponent } from 'src/app/shared/components/warband-dialog/warband-dialog.component';

@Component({
  selector: 'smitd-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  public themeList = Object.values(Theme);
  public languageList = Object.values(Language);

  constructor(
    public readonly core: CoreService,
    public readonly translationService: TranslationService,
    private readonly dialog: MatDialog,
    public readonly warbandService: WarbandService,
    public readonly battleService: BattleService
  ) {}

  public addWarband(): void {
    this.dialog
      .open(WarbandDialogComponent, {
        data: {},
        disableClose: true
      })
      .afterClosed()
      .subscribe((warband) => {
        if (warband) {
          this.warbandService.addWarband(warband);
        }
      });
  }

  public exportWarband(warband: Warband): void {
    const filename = `${warband.name
      .toLocaleLowerCase()
      .split(`'`)
      .join('')
      .split(' ')
      .join('-')}.json`;
    const jsonStr = JSON.stringify(warband);
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  public importWarband(): void {
    const upload: HTMLInputElement = document.createElement('input');
    upload.type = 'file';
    upload.style.display = 'none';
    document.body.appendChild(upload);
    upload.addEventListener('change', () => {
      if ((upload as any).files.length > 0) {
        const reader: FileReader = new FileReader();
        reader.addEventListener('load', () => {
          const warband = JSON.parse((reader as any).result) as Warband;
          if (this.warbandService.checkWarband(warband, false)) {
            this.dialog
              .open(WarbandDialogComponent, {
                data: {
                  warband: warband
                },
                disableClose: true
              })
              .afterClosed()
              .subscribe((newWarband) => {
                if (newWarband) {
                  this.warbandService.addWarband(newWarband);
                }
              });
          } else {
            this.warbandService.addWarband(warband);
          }
        });
        reader.readAsText((upload as any).files[0]);
      }
    });
    upload.click();
    document.body.removeChild(upload);
  }
}
