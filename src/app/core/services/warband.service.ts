import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Color } from '../enums/color.enum';
import { LocalStorageKey } from '../enums/local-keys.enum';
import { Fighter } from '../models/fighter.model';
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

  public checkWarband(warband: Warband, dialog: boolean = true): boolean {
    const check =
      -1 < this.warbands.findIndex((check) => warband.name === check.name);

    if (check && dialog) {
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
    }
    return check;
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
        notes: '',
        logs: []
      }
    }
  ): void {
    if (!this.checkWarband(warband)) {
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

  public updateWarband(warband: Warband): void {
    if (
      this.warbands.find(
        (check, index) =>
          warband.name === check.name && this.selectedWarbandIndex !== index
      )
    ) {
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
      this.core.setColor(warband.color);
      this.warbands[this.selectedWarbandIndex] = warband;
      this.saveWarbands();
    }
  }

  public selectWarband(index: number): void {
    this.selectedWarbandIndex = index;
    this.core.setColor(this.warbands[index].color);
    CoreService.setLocalStorage(
      LocalStorageKey.SelectedWarband,
      `${this.selectedWarbandIndex}`
    );
    this.router.navigate(['warband']);
  }

  public get selectedWarband(): Warband {
    return this.warbands[this.selectedWarbandIndex];
  }

  public moveFighter(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.selectedWarband.fighters,
      event.previousIndex,
      event.currentIndex
    );
    this.saveWarbands();
  }

  public addFighter(fighter: Fighter): void {
    this.selectedWarband.fighters.push(fighter);
    this.saveWarbands();
  }

  public updateFighter(fighter: Fighter, index: number): void {
    this.selectedWarband.fighters[index] = fighter;
    this.saveWarbands();
  }

  public removeFighter(
    index: number,
    removeCallBack: () => any = () => {}
  ): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          yesColor: 'warn',
          question: this.translateService.instant(
            'warband-service.fighter-remove',
            {
              warband: this.selectedWarband.name,
              fighter:
                this.selectedWarband.fighters[index].name ||
                this.selectedWarband.fighters[index].type
            }
          )
        }
      })
      .afterClosed()
      .subscribe((decision) => {
        if (decision) {
          this.selectedWarband.fighters.splice(index, 1);
          this.saveWarbands();
          removeCallBack();
        }
      });
  }
}
