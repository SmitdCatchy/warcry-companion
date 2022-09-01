import { Injectable } from '@angular/core';
import { LocalStorageKey } from '../enums/local-keys.enum';
import { Battleground } from '../models/battleground.model';
import { CoreService } from './core.service';
import { Ability } from '../models/ability.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class BattlegroundsService {
  private _battlegrounds: Battleground[];

  constructor(
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService
  ) {
    this._battlegrounds = JSON.parse(
      CoreService.getLocalStorage(
        LocalStorageKey.Battlegrounds,
        '[{"name": "universal", "abilities": [], "universal": true}]'
      )
    ) as Battleground[];
  }

  private saveBattlegrounds(): void {
    CoreService.setLocalStorage(
      LocalStorageKey.Battlegrounds,
      JSON.stringify(this._battlegrounds)
    );
  }

  public get universalAbilities(): Battleground {
    return this._battlegrounds[0];
  }

  public get battlegrounds(): Battleground[] {
    return this._battlegrounds;
  }

  public addBattleground(battleground: Battleground): void {
    if (battleground.universal) {
      this._battlegrounds[0] = battleground;
    } else if (
      this.battlegrounds.findIndex(
        (check) => check.name === battleground.name
      ) > -1
    ) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          confirmation: true,
          noLabel: 'common.ok',
          question: this.translateService.instant(
            'battlegrounds-service.exists',
            { battleground: battleground.name }
          )
        },
        closeOnNavigation: false
      });
    } else {
      this._battlegrounds.push(battleground);
      this.saveBattlegrounds();
    }
  }

  public uploadBattleground(battleground: Battleground): void {
    if (battleground.universal) {
      this._battlegrounds[0] = battleground;
      return;
    }
    const battlegroundIndex = this.battlegrounds.findIndex(
      (check) => check.name === battleground.name
    );
    if (battlegroundIndex > -1) {
      this.editBattleground(battlegroundIndex, battleground);
    } else {
      this._battlegrounds.push(battleground);
      this.saveBattlegrounds();
    }
  }

  public editBattleground(
    battlegroundIndex: number,
    battleground: Battleground
  ): void {
    if (
      !battleground.universal &&
      this.battlegrounds.findIndex(
        (check, index) =>
          index !== battlegroundIndex && check.name === battleground.name
      ) > -1
    ) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          confirmation: true,
          noLabel: 'common.ok',
          question: this.translateService.instant(
            'battlegrounds-service.exists',
            { battleground: battleground.name }
          )
        },
        closeOnNavigation: false
      });
    } else {
      this._battlegrounds[battlegroundIndex] = battleground;
      this.saveBattlegrounds();
    }
  }

  public removeBattleground(battlegroundIndex: number): void {
    this._battlegrounds.splice(battlegroundIndex, 1);
    this.saveBattlegrounds();
  }

  public addAbility(battlegroundIndex: number, ability: Ability): void {
    this._battlegrounds[battlegroundIndex].abilities.push(ability);
    this.saveBattlegrounds();
  }

  public editAbility(
    battlegroundIndex: number,
    abilityIndex: number,
    ability: Ability
  ): void {
    this._battlegrounds[battlegroundIndex].abilities[abilityIndex] = ability;
    this.saveBattlegrounds();
  }

  public removeAbility(battlegroundIndex: number, abilityIndex: number): void {
    this._battlegrounds[battlegroundIndex].abilities.splice(abilityIndex, 1);
    this.saveBattlegrounds();
  }
}
