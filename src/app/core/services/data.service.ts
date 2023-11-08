import { Injectable } from '@angular/core';
import { Warband } from '../models/warband.model';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { GrandAlliance } from '../enums/alliances.enum';
import { HttpClient } from '@angular/common/http';
import { Fighter } from '../models/fighter.model';
import { FighterRole } from '../enums/fighter-role.enum';
import { Weapon } from '../models/weapon.model';
import { Color } from '../enums/color.enum';
import { Ability } from '../models/ability.model';
import { TranslateService } from '@ngx-translate/core';
import { BattlegroundsService } from './battlegrounds.service';
import cloneDeep from 'lodash.clonedeep';
import { EncampmentState } from '../enums/encampment-state.enum';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _warbands: BehaviorSubject<Warband[]> = new BehaviorSubject(
    [] as Warband[]
  );

  constructor(
    private _http: HttpClient,
    private _translateService: TranslateService,
    private _battlegroundsService: BattlegroundsService
  ) {
    this._initializeWarbandsData();
  }

  get warbands(): Warband[] {
    return this._warbands.value;
  }

  getWarband(warbandName: string): Warband | undefined {
    return this.warbands.find((warband) => warband.name === warbandName);
  }

  getAlliance(alliance: GrandAlliance): Warband[] {
    return this.warbands.filter((warband) => warband.alliance === alliance);
  }

  private _initializeWarbandsData(): void {
    forkJoin([
      this._http.get<any[]>(
        'https://raw.githubusercontent.com/krisling049/warcry_data/main/data/fighters.json'
      ),
      this._http.get<any[]>(
        'https://raw.githubusercontent.com/krisling049/warcry_data/main/data/abilities.json'
      )
    ]).subscribe(([fightersData, abilitiesData]) => {
      const warbandMapper: any = {};
      fightersData.forEach((fighterData) => {
        const warbandName = fighterData.bladeborn
          ? fighterData.bladeborn
          : fighterData.warband;
        warbandMapper[warbandName] ??= {
          alliance: fighterData.grand_alliance,
          warband: fighterData.warband,
          fighters: [] as Fighter[],
          abilities: [],
          bladeborn: fighterData.bladeborn
        };
        warbandMapper[warbandName].fighters.push(
          this._parseFighter(fighterData)
        );
      });
      abilitiesData.forEach((abilityData) => {
        warbandMapper[abilityData.warband] ??= {
          warband: abilityData.warband,
          fighters: [],
          abilities: []
        };
        warbandMapper[abilityData.warband].abilities.push(
          this._parseAbility(abilityData)
        );
      });

      Object.keys(warbandMapper).forEach((warbandKey: any) => {
        if (
          warbandMapper[warbandKey].warband ===
          warbandMapper[warbandKey].alliance
        ) {
          const warbandName = `${this._translateService.instant(
            'warband-dialog.form.alliance.label'
          )} ${this._translateService.instant(
            `alliance.${warbandMapper[warbandKey].warband}`
          )}`;
          warbandMapper[warbandKey].warband = warbandName;
          warbandMapper[warbandName] = warbandMapper[warbandKey];
          delete warbandMapper[warbandKey];
        } else if (
          !warbandMapper[warbandKey].alliance &&
          warbandMapper[warbandKey].warband !== 'universal'
        ) {
          warbandMapper[warbandKey].fighters = warbandMapper[
            'Cities of Sigmar'
          ].fighters.map((fighter: Fighter) => {
            const mappedFighter = cloneDeep(fighter);
            mappedFighter.faction = warbandKey;
            return mappedFighter;
          });
          warbandMapper[
            warbandKey
          ].warband = `Cities of Sigmar - ${warbandKey}`;
          warbandMapper[warbandKey].alliance = 'order';
        }
        if (warbandMapper[warbandKey]?.bladeborn) {
          warbandMapper[warbandKey].abilities.push(
            ...warbandMapper[warbandMapper[warbandKey].warband].abilities
          );
        }
      });
      delete warbandMapper['Cities of Sigmar'];
      const commonAbilities: Ability[] = cloneDeep(
        warbandMapper['universal'].abilities
      );
      const universalAbilities = [
        commonAbilities[0],
        commonAbilities[1],
        commonAbilities[2],
        commonAbilities[3],
        commonAbilities[4],
        commonAbilities[8],
        commonAbilities[9],
        commonAbilities[10]
      ];
      universalAbilities.forEach(ability => {
        ability.prohibitiveRunemarks?.push('monster');
      })
      const monsterHuntAbilities = [
        commonAbilities[5],
        commonAbilities[6],
        commonAbilities[7],
        commonAbilities[11],
        commonAbilities[12],
        commonAbilities[13]
      ];
      monsterHuntAbilities[0].prohibitiveRunemarks?.push('monster');
      monsterHuntAbilities[1].prohibitiveRunemarks?.push('monster');
      monsterHuntAbilities[2].prohibitiveRunemarks?.push('monster');

      setTimeout(() => {
        this._battlegroundsService.uploadBattleground({
          name: 'universal',
          abilities: universalAbilities,
          universal: true
        });
        this._battlegroundsService.uploadBattleground({
          name: 'Monster Hunt',
          abilities: monsterHuntAbilities
        });
      }, 0);
      delete warbandMapper['universal'];
      this._warbands.next(
        Object.values(warbandMapper).map((warbandData: any) => ({
          name: `${warbandData.warband}${
            warbandData.bladeborn ? ` - ${warbandData.bladeborn}` : ''
          }`,
          bladeborn: warbandData.bladeborn,
          faction: warbandData.warband,
          alliance: warbandData.alliance,
          color: this._getFactionColor(warbandData.alliance) as Color,
          fighters: warbandData.fighters,
          abilities: warbandData.abilities,
          campaign: {
            name: '',
            limit: 1000,
            reputation: 2,
            glory: 0,
            progress: 0,
            notes: '',
            encampment: '',
            encampmentState: EncampmentState.Secure,
            quest: '',
            questProgress: 0
          }
        }))
      );
    });
  }

  private _parseFighter(fighterData: any): Fighter {
    const role: FighterRole = this._parseFighterRole(fighterData.runemarks);
    return {
      role,
      type: fighterData.name,
      bladeborn: fighterData.bladeborn,
      movement: fighterData.movement,
      toughness: fighterData.toughness,
      wounds: fighterData.wounds,
      runemarks: fighterData.runemarks,
      weapons: fighterData.weapons.map((weaponData: any) =>
        this._parseWeapon(weaponData)
      ),
      points: fighterData.points,
      modifiers: [],
      abilities: [],
      faction: fighterData.warband,
      alliance: fighterData.grand_alliance,
      color: this._getFactionColor(fighterData.grand_alliance),
      icon: `https://warcrier.net/img/fighters/${fighterData._id}.jpg`,
      monsterStatTable:
        role === FighterRole.Monster
          ? [
              {
                minHealth: 1,
                movement: fighterData.movement,
                damage: fighterData.weapons[0].dmg_hit,
                crit: fighterData.weapons[0].dmg_crit
              }
            ]
          : []
    };
  }

  private _parseFighterRole(runemarks: string[]): FighterRole {
    if (runemarks.find((check) => check === FighterRole.Beast))
      return FighterRole.Beast;
    if (runemarks.find((check) => check === FighterRole.Ally))
      return FighterRole.Ally;
    if (runemarks.find((check) => check === FighterRole.Monster))
      return FighterRole.Monster;
    if (runemarks.find((check) => check === FighterRole.Thrall))
      return FighterRole.Thrall;
    if (runemarks.find((check) => check === FighterRole.Hero))
      return FighterRole.Hero;
    return FighterRole.Fighter;
  }

  private _parseWeapon(weaponData: any): Weapon {
    return {
      range: weaponData.min_range
        ? `${weaponData.min_range}-${weaponData.max_range}`
        : weaponData.max_range,
      attacks: weaponData.attacks,
      strength: weaponData.strength,
      damage: weaponData.dmg_hit,
      crit: weaponData.dmg_crit,
      runemark: weaponData.runemark
    };
  }

  private _getFactionColor(alliance: GrandAlliance): string {
    switch (alliance) {
      case GrandAlliance.Chaos:
        return Color.red;
      case GrandAlliance.Death:
        return Color.purple;
      case GrandAlliance.Destruction:
        return Color.green;
      case GrandAlliance.Order:
        return Color.blue;
      default:
        return Color.orange;
    }
  }

  private _parseAbility(abilityData: any): Ability {
    return {
      type: abilityData.cost,
      runemarks:
        abilityData.warband !== 'universal'
          ? [abilityData.warband, ...abilityData.runemarks]
          : abilityData.runemarks,
      prohibitiveRunemarks: [],
      title: abilityData.name,
      description: abilityData.description
    };
  }
}
