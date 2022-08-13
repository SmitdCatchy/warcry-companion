import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AbilitiesBottomSheetComponent } from 'src/app/shared/components/abilities-bottom-sheet/abilities-bottom-sheet.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { LogsBottomSheetComponent } from 'src/app/shared/components/logs-bottom-sheet/logs-bottom-sheet.component';
import { Battleground } from '../enums/battle-ground.enum';
import { Color } from '../enums/color.enum';
import { LocalStorageKey } from '../enums/local-keys.enum';
import { Ability } from '../models/ability.model';
import { BattleLog } from '../models/battle-log.model';
import { Fighter } from '../models/fighter.model';
import { Warband } from '../models/warband.model';
import { CoreService } from './core.service';

@Injectable({
  providedIn: 'root'
})
export class WarbandService {
  public warbands: Warband[];
  public selectedWarbandIndex: number;
  public universalAbilities: Ability[];

  constructor(
    private readonly core: CoreService,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,
    private readonly bottomSheet: MatBottomSheet
  ) {
    this.warbands = JSON.parse(
      CoreService.getLocalStorage(LocalStorageKey.Warbands, '[]')
    ) as Warband[];

    this.universalAbilities = JSON.parse(
      CoreService.getLocalStorage(LocalStorageKey.UniversalAbilities, '[]')
    ) as Ability[];

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
        notes: ''
      },
      logs: []
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

  private saveUniversalSettings(): void {
    CoreService.setLocalStorage(
      LocalStorageKey.UniversalAbilities,
      JSON.stringify(this.universalAbilities)
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

  public pushLog(log: BattleLog): void {
    if (!this.selectedWarband.logs) {
      this.selectedWarband.logs = [];
    }
    this.selectedWarband.logs.unshift(log);
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

  public showAbilities(
    abilities: Ability[],
    fighter?: Fighter,
    warband?: Warband,
    universal: boolean = false,
    showRunemarks: boolean = false,
    restrictions?: Battleground[]
  ): void {
    const abilityGroups = [
      {
        label: this.translateService
          .instant('warband-service.abilities.label', {
            label: fighter?.type || warband?.faction || ''
          })
          .trim(),
        abilities: abilities.filter((ability) => {
          if (fighter) {
            if (
              !ability.runemarks.every((runemark) =>
                fighter.runemarks.includes(runemark)
              )
            ) {
              return false;
            }
          }
          return true;
        })
      }
    ];

    if (universal) {
      abilityGroups.push({
        label: this.translateService.instant(
          'warband-service.abilities.universal'
        ),
        abilities: this.universalAbilities.filter((ability: Ability) => {
          if (fighter) {
            if (
              !ability.runemarks.every((runemark) =>
                fighter.runemarks.includes(runemark)
              )
            ) {
              return false;
            }
          }
          return true;
        })
      });
    }
    this.bottomSheet.open(AbilitiesBottomSheetComponent, {
      data: { abilityGroups, showRunemarks }
    });
  }

  public get hasLogs(): boolean {
    return !!this.selectedWarband.logs && this.selectedWarband.logs.length > 0;
  }

  public showLogs(): void {
    this.bottomSheet.open(LogsBottomSheetComponent, {
      data: { logs: this.selectedWarband.logs }
    });
  }

  public addUniversalAbility(ability: Ability): void {
    this.universalAbilities.push(ability);
    this.saveUniversalSettings();
  }

  public editUniversalAbility(ability: Ability, index: number): void {
    this.universalAbilities[index] = ability;
    this.saveUniversalSettings();
  }

  public removeUniversalAbility(index: number): void {
    this.universalAbilities.splice(index, 1);
    this.saveUniversalSettings();
  }
}
