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
import { EncampmentState } from '../enums/encampment-state.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  public battle: Battle;
  public battleSubject: Subject<any>;

  constructor(
    private readonly core: CoreService,
    private readonly warbandService: WarbandService,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,
    private readonly popup: MatSnackBar,
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
    this.battleSubject = new Subject();
  }

  public prepareBattle(warband?: Warband): void {
    this.dialog
      .open(BattleDialogComponent, {
        data: {
          battle: this.battle,
          warband: cloneDeep(warband)
        },
        // panelClass: ['full-screen-modal'],
        closeOnNavigation: false
      })
      .afterClosed()
      .subscribe((battleConfiguration) => {
        if (battleConfiguration) {
          if (battleConfiguration.newBattle) {
            this.battle = battleConfiguration.battle;
            this.saveBattle();
          }
          this.core.setColor(this.battle.warband.color);
          this.router.navigate(['battle']);
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
        name: this.translateService.instant('battle-page.quick'),
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
          progress: 0,
          notes: '',
          encampment: '',
          encampmentState: EncampmentState.Secure,
          quest: '',
          questProgress: 0
        }
      },
      roster: [],
      hammer: [],
      shield: [],
      dagger: [],
      wild: [],
      battleState: BattleState.Peace,
      turn: 1,
      victoryPoints: 0,
      campaign: false
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

  public reassignFighter(
    reference: FighterReference,
    from: FighterReference[],
    to: FighterReference[],
    referenceIndex: number
  ): void {
    to.push(reference);
    from.splice(referenceIndex, 1);
    this.saveBattle();
  }

  public addFighter(cb: () => any = () => {}): void {
    this.dialog
      .open(FighterDialogComponent, {
        data: {},
        disableClose: true,
        panelClass: ['full-screen-modal'],
        closeOnNavigation: false
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
          cb();
        }
      });
  }

  public addWildFighter(cb: () => any = () => {}): void {
    this.dialog
      .open(FighterDialogComponent, {
        data: {},
        disableClose: true,
        panelClass: ['full-screen-modal'],
        closeOnNavigation: false
      })
      .afterClosed()
      .subscribe((fighter: Fighter) => {
        if (fighter) {
          const wildFighter = BattleService.createFighterReference(
            fighter,
            this.battle.wild.length
          );
          this.addWildFighterEffect(wildFighter, cb);
          this.battleSubject.next({
            changed: 'wild-fighter',
            wildFighter
          });
        }
      });
  }

  public addWildFighterEffect(
    wildFighter: FighterReference,
    cb: () => any = () => {}
  ): void {
    this.battle.wild.push(wildFighter);
    this.saveBattle();
    cb();
  }

  public removeWildFighter(index: number, cb: () => any = () => {}): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          yesColor: 'warn',
          question: this.translateService.instant(
            'battle-service.dialog.remove-wild'
          )
        },
        closeOnNavigation: false
      })
      .afterClosed()
      .subscribe((decision) => {
        if (decision) {
          this.removeWildFighterEffect(index, cb);
          this.battleSubject.next({
            changed: 'wild-fighter-remove',
            wildFighter: index
          });
        }
      });
  }

  public removeWildFighterEffect(
    index: number,
    cb: () => any = () => {}
  ): void {
    this.battle.wild.splice(index, 1);
    this.saveBattle();
    cb();
  }

  public static createFighterReference(
    fighter: Fighter,
    index: number
  ): FighterReference {
    const stats = cloneDeep(fighter);
    const artefacts: Modifier[] = [];
    const injuries: Modifier[] = [];
    const availableRenown: boolean[] = [];
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
    let traits: Modifier[] = [];
    stats.modifiers.forEach((modifier: Modifier) => {
      switch (modifier.type) {
        case ModifierType.Artefact:
          artefacts.push(modifier);
          break;
        case ModifierType.Trait:
          traits.push(modifier);
          break;
        case ModifierType.Injury:
          injuries.push(modifier);
          break;
        default:
          console.error('UNKONWN MODIFIER', modifier);
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

    for (let i = 0; i < (fighter.renown || 0); i++) {
      availableRenown.push(false);
    }

    return {
      state: FighterState.Ready,
      stats,
      fighterIndex: index,
      wounds: stats.wounds + modifiers.wounds,
      inititalWounds: stats.wounds + modifiers.wounds,
      modifiers: modifiers,
      artefacts,
      injuries,
      traits,
      availableRenown
    };
  }

  public useRenown(
    fighter: FighterReference,
    renownIndex: number,
    group: string,
    index: number
  ): void {
    fighter.availableRenown![renownIndex] =
      !fighter.availableRenown![renownIndex];
    this.saveBattle();
    this.battleSubject.next({
      changed: 'fighter',
      fighter,
      group,
      index
    });
  }

  public toggleTreasure(
    fighter: FighterReference,
    group: string,
    index: number
  ): void {
    fighter.carryingTreasure = !fighter.carryingTreasure;
    this.saveBattle();
    this.battleSubject.next({
      changed: 'fighter',
      fighter,
      group,
      index
    });
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

  public checkForReadyFighters(): FighterReference[] {
    return this.allFighters.filter(
      (fighter) =>
        fighter.state !== FighterState.Activated &&
        fighter.state !== FighterState.Dead
    );
  }

  public endTurn(cb: () => any = () => {}): void {
    const readyFighters = this.checkForReadyFighters();
    if (readyFighters.length) {
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            question: this.translateService.instant(
              'battle-service.dialog.ready'
            ),
            list: readyFighters.map(
              (fighter) => fighter.stats.name || fighter.stats.type
            )
          },
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((decision) => {
          if (decision) {
            this.endTurnEffect(cb());
            this.battleSubject.next({
              changed: 'end-turn'
            });
          }
        });
    } else {
      this.endTurnEffect(cb());
      this.battleSubject.next({
        changed: 'end-turn'
      });
    }
  }

  public endTurnEffect(cb: () => any = () => {}): void {
    this.readyFighters();
    this.battle.turn++;
    this.saveBattle();
    this.turnEndPopup();
    cb();
  }

  private turnEndPopup(): void {
    this.popup.open(
      `${this.translateService.instant('battle-page.battle.turn', {
        turn: this.battle.turn
      })}`,
      undefined,
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1000,
        panelClass: 'turn-counter-snackbar'
      }
    );
  }

  public abortBattle(): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          yesColor: 'warn',
          question: this.translateService.instant('battle-service.dialog.abort')
        },
        closeOnNavigation: false
      })
      .afterClosed()
      .subscribe((decision) => {
        if (decision) {
          this.clearBattle();
          this.back();
        }
      });
  }

  public endBattle(cb: () => any = () => {}): void {
    this.core.setColor(this.battle.warband.color);
    if (this.battle.warband.alliance) {
      if (this.battle.battleState === BattleState.Battle) {
        this.dialog
          .open(BattleEndDialogComponent, {
            data: {
              battle: this.battle
            },
            closeOnNavigation: false
          })
          .afterClosed()
          .subscribe((result) => {
            if (result) {
              if (!this.warbandService.selectedWarband.logs) {
                this.warbandService.selectedWarband.logs = [];
              }
              const date = new Date();
              this.warbandService.pushLog({
                date: `${date.getFullYear()}.${
                  date.getMonth() + 1 < 10
                    ? `0${date.getMonth() + 1}`
                    : date.getMonth() + 1
                }.${date.getDate()}.`,
                outcome: result.outcome,
                enemy: result.enemy,
                campaign: this.battle.campaign,
                casualities: this.allFighters
                  .filter((fighter) => fighter.state === FighterState.Dead)
                  .map((referenc) => ({
                    type: referenc.stats.type,
                    name: referenc.stats.name
                  }))
              });
              if(this.battle.campaign) {
                this.battle.survivors = [];
                this.battle.fallen = [];
                this.battle.outcome = result.outcome;
                this.allFighters
                  .sort((a, b) => (a.fighterIndex < b.fighterIndex ? -1 : 1))
                  .forEach((fighterRef) => {
                    fighterRef.carryingTreasure = false;
                    fighterRef.artefacts.forEach((artefact) => {
                      fighterRef.stats.modifiers.forEach((modifier) => {
                        if (modifier.name === artefact.name) {
                          modifier.used = artefact.used;
                        }
                      });
                    });
                    if (fighterRef.wounds > 0) {
                      this.battle.survivors!.push(fighterRef);
                    } else {
                      this.battle.fallen!.push(fighterRef);
                    }
                  });
                this.battle.battleState = BattleState.Aftermath;
                this.saveBattle();
                cb();
              } else {
                this.clearBattle();
                this.back();
              }
            }
          });
      } else {
        this.dialog
          .open(ConfirmDialogComponent, {
            data: {
              question: 'battle-end-dialog.aftermath',
              yesColor: 'warn'
            },
            closeOnNavigation: false
          })
          .afterClosed()
          .subscribe((result) => {
            if (result) {
              this.clearBattle();
              this.back();
            }
          });
      }
    } else {
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            question: 'battle-end-dialog.question',
            yesColor: 'warn'
          },
          closeOnNavigation: false
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
    return this.allFighters.reduce(
      (sum, fighter) => sum + fighter.stats.points,
      0
    );
  }

  public beginBattle(): void {
    if (this.warbandSize < this.battle.warband.campaign.limit) {
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            question: this.translateService.instant(
              'battle-service.dialog.begin',
              {
                limit: this.battle.warband.campaign.limit,
                size: this.warbandSize
              }
            ),
            yesColor: 'accent'
          },
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.battle.battleState = BattleState.Battle;
            this.saveBattle();
            this.battleSubject.next({
              changed: 'begin'
            });
          }
        });
    } else {
      this.battle.battleState = BattleState.Battle;
      this.saveBattle();
    }
  }
}
