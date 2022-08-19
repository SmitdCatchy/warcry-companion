import { Injectable } from '@angular/core';
import { LocalStorageKey } from '../enums/local-keys.enum';
import { Battleground } from '../models/battleground.model';
import { CoreService } from './core.service';
import { Ability } from '../models/ability.model';

@Injectable({
  providedIn: 'root'
})
export class BattlegroundsService {
  private _battlegrounds: Battleground[];

  constructor() {
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
    if(this.battlegrounds.findIndex(check => check.name === battleground.name) > -1) {
      // err
    } else {
      this._battlegrounds.push(battleground);
      this.saveBattlegrounds();
    }
  }

  public editBattleground(
    battlegroundIndex: number,
    battleground: Battleground
  ): void {
    this._battlegrounds[battlegroundIndex] = battleground;
    this.saveBattlegrounds();
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
