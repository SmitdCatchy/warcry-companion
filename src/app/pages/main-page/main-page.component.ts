import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Language } from 'src/app/core/enums/language.enum';
import { Theme } from 'src/app/core/enums/theme.enum';
import { Warband } from 'src/app/core/models/warband.model';
import { BattleService } from 'src/app/core/services/battle.service';
import { CoreService } from 'src/app/core/services/core.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { WarbandService } from 'src/app/core/services/warband.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { WarbandDialogComponent } from 'src/app/shared/components/warband-dialog/warband-dialog.component';

export const warbandFileType = 'warband';

@Component({
  selector: 'smitd-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnDestroy {
  public themeList = Object.values(Theme);
  public languageList = Object.values(Language);
  private _subscriptions = new Subscription();

  constructor(
    public readonly core: CoreService,
    public readonly translationService: TranslationService,
    private readonly dialog: MatDialog,
    public readonly warbandService: WarbandService,
    public readonly battleService: BattleService,
    private readonly translateService: TranslateService
  ) {}

  public ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public addWarband(): void {
    history.pushState({ isDialog: true }, '');
    this._subscriptions.add(
      this.dialog
        .open(WarbandDialogComponent, {
          data: {},
          disableClose: true,
          panelClass: ['full-screen-modal'],
          closeOnNavigation: true
        })
        .afterClosed()
        .subscribe((warband) => {
          if (warband) {
            this.warbandService.addWarband(warband);
          }
          if (history.state.isDialog) {
            history.back();
          }
        })
    );
  }

  public duplicateWarband(warband: Warband): void {
    history.pushState({ isDialog: true }, '');
    this._subscriptions.add(
      this.dialog
        .open(WarbandDialogComponent, {
          data: { warband },
          disableClose: true,
          panelClass: ['full-screen-modal'],
          closeOnNavigation: true
        })
        .afterClosed()
        .subscribe((warband) => {
          if (warband) {
            this.warbandService.addWarband(warband);
          }
          if (history.state.isDialog) {
            history.back();
          }
        })
    );
  }

  public exportWarband(warband: Warband): void {
    const filename = `${warband.name
      .toLocaleLowerCase()
      .split(`'`)
      .join('')
      .split(' ')
      .join('-')}.json`;
    const jsonStr = JSON.stringify({ type: warbandFileType, warband });
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
    this.core.handleFileUpload(
      (result) => {
        const warband = result.warband as Warband;
        if (this.warbandService.checkWarband(warband, false)) {
          history.pushState({ isDialog: true }, '');
          this._subscriptions.add(
            this.dialog
              .open(WarbandDialogComponent, {
                data: {
                  warband: warband
                },
                disableClose: true,
                panelClass: ['full-screen-modal'],
                closeOnNavigation: true
              })
              .afterClosed()
              .subscribe((newWarband) => {
                if (newWarband) {
                  this.warbandService.addWarband(newWarband);
                }
                if (history.state.isDialog) {
                  history.back();
                }
              })
          );
          this.core.stopLoader();
        } else {
          this.warbandService.addWarband(warband);
          history.pushState({ isDialog: true }, '');
          this._subscriptions.add(
            this.dialog
              .open(ConfirmDialogComponent, {
                data: {
                  confirmation: true,
                  noLabel: this.translateService.instant('common.ok'),
                  question: this.translateService.instant('import.success')
                },
                closeOnNavigation: true
              })
              .afterClosed().subscribe(() => {
                if (history.state.isDialog) {
                  history.back();
                }
              })
          );
          this.core.stopLoader();
        }
      },
      'json',
      warbandFileType
    );
  }
}
