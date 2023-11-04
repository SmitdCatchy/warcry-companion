import { Injectable } from '@angular/core';
import { LocalStorageKey, StoreKey } from '../enums/local-keys.enum';
import { Battleground } from '../models/battleground.model';
import { CoreService } from './core.service';
import { Ability } from '../models/ability.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BattlegroundsService {
  private _battlegrounds: Battleground[];
  _loaded: BehaviorSubject<boolean> = new BehaviorSubject(false as boolean);

  constructor(
    private readonly core: CoreService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService
  ) {
    this._battlegrounds = JSON.parse(
      CoreService.getLocalStorage(
        LocalStorageKey.Battlegrounds,
        '[{"name": "universal", "abilities": [], "universal": true}]'
      )
    ) as Battleground[];
    this.core.getStore(StoreKey.BattlegroundsStore).subscribe((battlegrounds: Battleground[]) => {
      this._battlegrounds = battlegrounds;
      this._loaded.next(true);
    });
  }

  private saveBattlegrounds(): void {
    this.core.setStore({
      name: StoreKey.BattlegroundsStore,
      data: this._battlegrounds
    })
  }

  get universalAbilities(): Battleground {
    return this._battlegrounds[0];
  }

  get battlegrounds(): Battleground[] {
    return this._battlegrounds;
  }

  get loaded(): Observable<boolean> {
    return this._loaded.asObservable();
  }

  get loadedValue(): boolean {
    return this._loaded.value;
  }

  addBattleground(battleground: Battleground): void {
    if (battleground.universal) {
      this._battlegrounds[0] = battleground;
      this.saveBattlegrounds();
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

  uploadBattleground(battleground: Battleground): void {
    if (battleground.universal) {
      this._battlegrounds[0] = battleground;
      this.saveBattlegrounds();
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

  editBattleground(
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

  removeBattleground(battlegroundIndex: number): void {
    this._battlegrounds.splice(battlegroundIndex, 1);
    this.saveBattlegrounds();
  }

  addAbility(battlegroundIndex: number, ability: Ability): void {
    this._battlegrounds[battlegroundIndex].abilities.push(ability);
    this.saveBattlegrounds();
  }

  editAbility(
    battlegroundIndex: number,
    abilityIndex: number,
    ability: Ability
  ): void {
    this._battlegrounds[battlegroundIndex].abilities[abilityIndex] = ability;
    this.saveBattlegrounds();
  }

  removeAbility(battlegroundIndex: number, abilityIndex: number): void {
    this._battlegrounds[battlegroundIndex].abilities.splice(abilityIndex, 1);
    this.saveBattlegrounds();
  }
}
