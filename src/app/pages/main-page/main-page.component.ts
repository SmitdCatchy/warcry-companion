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
  themeList = Object.values(Theme);
  languageList = Object.values(Language);
  private _subscriptions = new Subscription();

  constructor(
    readonly core: CoreService,
    readonly translationService: TranslationService,
    private readonly dialog: MatDialog,
    readonly warbandService: WarbandService,
    readonly battleService: BattleService,
    private readonly translateService: TranslateService
  ) {}

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  addWarband(): void {
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

  duplicateWarband(warband: Warband): void {
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

  exportWarband(warband: Warband): void {
    const filename = `${warband.name
      .toLocaleLowerCase()
      .split(`'`)
      .join('')
      .split(' ')
      .join('-')
      .split('---')
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

  importWarband(): void {
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
              .afterClosed()
              .subscribe(() => {
                if (history.state.isDialog) {
                  history.back();
                }
              })
          );
        }
      },
      'json',
      warbandFileType
    );
  }

  getLatestVersion(): void {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        caches.delete(key);
      });
    });
    location.reload();
  }
}
