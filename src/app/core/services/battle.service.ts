import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Color } from '../enums/color.enum';
import { Warband } from '../models/warband.model';
import cloneDeep from 'lodash.clonedeep';
import { Fighter } from '../models/fighter.model';
import { BattleState } from '../enums/battle-state.enum';
import { CoreService } from './core.service';
import { LocalStorageKey } from '../enums/local-keys.enum';
import { Battle } from '../models/battle.model';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BattleDialogComponent } from 'src/app/shared/components/battle-dialog/battle-dialog.component';
import { FighterReference } from '../models/fighter-reference.model';
import { FighterState } from '../enums/fighter-state.enum';
import { ModifierType } from '../enums/modifier-type.enum';
import { Modifier } from '../models/modifier.model';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { WarbandService } from './warband.service';
import { FighterDialogComponent } from 'src/app/shared/components/fighter-dialog/fighter-dialog.component';
import { BattleEndDialogComponent } from 'src/app/shared/components/battle-end-dialog/battle-end-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  public battle: Battle;

  constructor(
    private readonly core: CoreService,
    private readonly warbandService: WarbandService,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,
    private location: Location
  ) {
    this.battle = JSON.parse(
      CoreService.getLocalStorage(
        LocalStorageKey.Battle,
        JSON.stringify({
          warband: {
            name: '',
            faction: '',
            alliance: '',
            color: '#424242',
            fighters: [],
            abilities: [],
            campaign: {
              name: '',
              limit: 1000,
              reputation: 2,
              glory: 0,
              notes: ''
            }
          },
          roster: [],
          hammer: [],
          shield: [],
          dagger: [],
          wild: [],
          battleState: BattleState.Peace,
          turn: 1,
          victoryPoints: 0
        })
      )
    );
  }

  public prepareBattle(warband?: Warband): void {
    this.dialog
      .open(BattleDialogComponent, {
        data: {
          battle: this.battle,
          warband: cloneDeep(warband)
        }
      })
      .afterClosed()
      .subscribe((battleConfiguration) => {
        if (battleConfiguration) {
          if (battleConfiguration.newBattle) {
            this.battle = battleConfiguration.battle;
            this.saveBattle();
          }
          this.router.navigate(['battle']);
          this.core.setColor(this.battle.warband.color);
        }
      });
  }

  public saveBattle(): void {
    CoreService.setLocalStorage(
      LocalStorageKey.Battle,
      JSON.stringify(this.battle)
    );
  }

  public clearBattle(): void {
    this.battle = {
      warband: {
        name: 'battle-page.quick',
        faction: '',
        alliance: '',
        color: Color.grey,
        fighters: [],
        abilities: [],
        campaign: {
          name: '',
          limit: 1000,
          reputation: 2,
          glory: 0,
          notes: ''
        }
      },
      roster: [],
      hammer: [],
      shield: [],
      dagger: [],
      wild: [],
      battleState: BattleState.Peace,
      turn: 1,
      victoryPoints: 0
    };
    this.saveBattle();
  }

  public moveFighter(event: any): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.saveBattle();
  }

  public addFighter(): void {
    this.dialog
      .open(FighterDialogComponent, {
        data: {},
        disableClose: true,
        panelClass: ['full-screen-modal']
      })
      .afterClosed()
      .subscribe((fighter: Fighter) => {
        if (fighter) {
          this.battle.roster.push(
            BattleService.createFighterReference(
              fighter,
              this.battle.roster.length
            )
          );
          this.saveBattle();
        }
      });
  }

  public addWildFighter(): void {
    this.dialog
      .open(FighterDialogComponent, {
        data: {},
        disableClose: true,
        panelClass: ['full-screen-modal']
      })
      .afterClosed()
      .subscribe((fighter: Fighter) => {
        if (fighter) {
          this.battle.wild.push(
            BattleService.createFighterReference(
              fighter,
              this.battle.wild.length
            )
          );
          this.saveBattle();
        }
      });
  }

  public removeWildFighter(index: number): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          yesColor: 'warn',
          question: this.translateService.instant(
            'battle-service.dialog.remove-wild'
          )
        }
      })
      .afterClosed()
      .subscribe((decision) => {
        if (decision) {
          this.battle.wild.splice(index, 1);
          this.saveBattle();
        }
      });
  }

  public static createFighterReference(
    fighter: Fighter,
    index: number
  ): FighterReference {
    const stats = cloneDeep(fighter);
    const artefacts: Modifier[] = [];
    const injuries: Modifier[] = [];
    const modifiers = {
      weapons: [
        {
          attacks: 0,
          strength: 0,
          damage: 0,
          crit: 0
        },
        {
          attacks: 0,
          strength: 0,
          damage: 0,
          crit: 0
        }
      ],
      movement: 0,
      toughness: 0,
      wounds: 0
    };
    let trait;

    stats.modifiers.forEach((modifier: Modifier) => {
      switch (modifier.type) {
        case ModifierType.Artefact:
          artefacts.push(modifier);
          break;
        case ModifierType.Trait:
          trait = modifier;
          break;
        case ModifierType.Injury:
          injuries.push(modifier);
          break;
        default:
          console.error('UNKONWN MODIFIER');
          return;
      }
      const modification = modifier.modify;
      if (modification) {
        modifiers.movement += modification.movement || 0;
        modifiers.toughness += modification.toughness || 0;
        modifiers.wounds += modification.wounds || 0;
        stats.weapons.forEach((weapon, index) => {
          const weaponModification = modification.weapon;
          const modifiedWeapon = modifiers.weapons[index];
          if (
            weaponModification &&
            ((!weaponModification.ranged && weapon.range < 4) ||
              (weaponModification.ranged && isNaN(weapon.range as number)) ||
              (weaponModification.ranged && weapon.range > 3))
          ) {
            modifiedWeapon.attacks += weaponModification.attacks || 0;
            modifiedWeapon.strength += weaponModification.strength || 0;
            modifiedWeapon.damage += weaponModification.damage || 0;
            modifiedWeapon.crit += weaponModification.crit || 0;
          }
        });
      }
    });

    return {
      state: FighterState.Ready,
      stats,
      fighterIndex: index,
      wounds: stats.wounds,
      modifiers: modifiers,
      artefacts,
      injuries,
      trait
    };
  }

  public get allFighters(): FighterReference[] {
    return [
      ...this.battle.dagger,
      ...this.battle.shield,
      ...this.battle.hammer
    ];
  }

  public readyFighters(): void {
    this.allFighters.forEach((fighter) => {
      if (fighter.state !== FighterState.Dead) {
        fighter.state = FighterState.Ready;
      }
    });
  }

  public checkForReadyFighters(): boolean {
    return (
      this.allFighters.findIndex(
        (fighter) =>
          fighter.state !== FighterState.Activated &&
          fighter.state !== FighterState.Dead
      ) > -1
    );
  }

  public endTurn(): void {
    if (this.checkForReadyFighters()) {
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            question: this.translateService.instant(
              'battle-service.dialog.ready'
            )
          }
        })
        .afterClosed()
        .subscribe((decision) => {
          if (decision) {
            this.readyFighters();
            this.battle.turn++;
            this.saveBattle();
          }
        });
    } else {
      this.readyFighters();
      this.battle.turn++;
      this.saveBattle();
    }
  }

  public abortBattle(): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          yesColor: 'warn',
          question: this.translateService.instant('battle-service.dialog.abort')
        }
      })
      .afterClosed()
      .subscribe((decision) => {
        if (decision) {
          this.clearBattle();
          this.back();
        }
      });
  }

  public endBattle(): void {
    if (this.battle.warband.alliance) {
      this.dialog
        .open(BattleEndDialogComponent, {
          data: {
            battle: this.battle
          }
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            if (!this.warbandService.selectedWarband.logs) {
              this.warbandService.selectedWarband.logs = [];
            }
            const date = new Date();
            this.warbandService.pushLog({
              date: `${date.getFullYear()}.${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}.${date.getDate()}.`,
              victory: result.victory,
              enemy: result.enemy,
              campaign: this.battle.campaign,
              casualities: this.allFighters
                .filter((fighter) => fighter.state === FighterState.Dead)
                .map((referenc) => referenc.stats)
            });
            this.clearBattle();
            this.back();
          }
        });
    } else {
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            question: 'battle-end-dialog.question',
            yesColor: 'warn'
          }
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.clearBattle();
            this.back();
          }
        });
    }
  }

  public back(): void {
    this.location.back();
  }

  public get warbandSize(): number {
    return [
      ...this.battle.dagger,
      ...this.battle.shield,
      ...this.battle.hammer
    ].reduce((sum, fighter) => sum + fighter.stats.points, 0);
  }

  public beginBattle(): void {
    this.battle.battleState = BattleState.Battle;
    this.saveBattle();
  }
}
