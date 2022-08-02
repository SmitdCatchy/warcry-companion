import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Color } from '../enums/color.enum';
import { LocalStorageKey } from '../enums/local-keys.enum';
import { Warband } from '../models/warband.model';
import { CoreService } from './core.service';

@Injectable({
  providedIn: 'root'
})
export class WarbandService {
  public warbands: Warband[];
  public selectedWarbandIndex: number;

  constructor(
    private readonly core: CoreService,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog
  ) {
    this.warbands = JSON.parse(
      CoreService.getLocalStorage(LocalStorageKey.Warbands, '[]')
    ) as Warband[];

    this.selectedWarbandIndex = +CoreService.getLocalStorage(
      LocalStorageKey.SelectedWarband,
      '0'
    ) as number;
  }

  public addWarband(
    warband: Warband = {
      name: this.translateService.instant('common.unknown'),
      faction: this.translateService.instant('common.unaligned'),
      alliance: this.translateService.instant('common.unaligned'),
      color: Color.grey,
      fighters: [],
      abilities: [],
      campaign: {
        name: this.translateService.instant('common.unknown'),
        limit: 1000,
        reputation: 2,
        glory: 0,
        notes: ''
      }
    }
  ): void {
    if (this.warbands.find((check) => warband.name === check.name)) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          confirmation: true,
          noLabel: 'common.ok',
          question: this.translateService.instant(
            'warband-service.warband-exists',
            { warband: warband.name }
          )
        }
      });
    } else {
      this.warbands.push(warband);
      this.core.setColor(warband.color);
      this.saveWarbands();
    }
  }

  public removeWarband(
    index: number,
    removeCallBack: () => any = () => {}
  ): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          yesColor: 'warn',
          question: this.translateService.instant(
            'warband-service.warband-remove',
            { warband: this.warbands[index].name }
          )
        }
      })
      .afterClosed()
      .subscribe((decision) => {
        if (decision) {
          this.warbands.splice(index, 1);
          this.saveWarbands();
          removeCallBack();
        }
      });
  }

  public moveWarband(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.warbands, event.previousIndex, event.currentIndex);
    this.saveWarbands();
  }

  private saveWarbands(): void {
    CoreService.setLocalStorage(
      LocalStorageKey.Warbands,
      JSON.stringify(this.warbands)
    );
  }

  public updateWarband(warband: Warband = this.selectedWarband): void {
    const warbandIndex = this.warbands.findIndex(
      (check) => check.name === warband.name
    );
    this.warbands[warbandIndex] = warband;
    this.saveWarbands();
  }

  public selectWarband(index: number): void {
    this.selectedWarbandIndex = index;
    this.core.setColor(this.warbands[index].color);
    this.router.navigate(['warband']);
  }

  public get selectedWarband(): Warband {
    return this.warbands[this.selectedWarbandIndex];
  }
}
