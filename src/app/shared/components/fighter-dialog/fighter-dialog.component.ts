import { Component, Inject, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { COMMA, ENTER, PERIOD } from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FighterRole } from 'src/app/core/enums/fighter-role.enum';
import { Fighter } from 'src/app/core/models/fighter.model';
import { Weapon } from 'src/app/core/models/weapon.model';
import { MonsterStat } from 'src/app/core/models/monster-stat.model';
import { FighterStoreService } from 'src/app/core/services/fighter-store.service';
import { Subscription } from 'rxjs';
import { FighterStoreDialogComponent } from '../fighter-store-dialog/fighter-store-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import cloneDeep from 'lodash.clonedeep';

@Component({
  selector: 'smitd-fighter-dialog',
  templateUrl: './fighter-dialog.component.html',
  styleUrls: ['./fighter-dialog.component.scss']
})
export class FighterDialogComponent implements OnDestroy {
  public fighterForm: FormGroup;
  public separatorKeysCodes: number[] = [ENTER, COMMA, PERIOD];
  public runemarkCtrl = new FormControl('');
  public fighterRoleList = Object.values(FighterRole);
  public FighterRole = FighterRole;
  public existsInStore: boolean;
  private _subscriptions: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<FighterDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      fighter: Fighter;
      edit: boolean;
      storeDialog: boolean;
    },
    public readonly fighterStore: FighterStoreService,
    private readonly dialog: MatDialog
  ) {
    const fighterCopy = data.fighter ? cloneDeep(data.fighter) : undefined;
    this.fighterForm = new FormGroup({
      name: new FormControl(fighterCopy ? fighterCopy.name : '', []),
      role: new FormControl(
        fighterCopy ? fighterCopy.role : FighterRole.Fighter,
        [Validators.required]
      ),
      type: new FormControl(fighterCopy ? fighterCopy.type : '', [
        Validators.required
      ]),
      movement: new FormControl(
        fighterCopy ? fighterCopy.movement : undefined,
        [Validators.required, Validators.min(1), Validators.max(99)]
      ),
      toughness: new FormControl(
        fighterCopy ? fighterCopy.toughness : undefined,
        [Validators.required, Validators.min(1), Validators.max(99)]
      ),
      wounds: new FormControl(fighterCopy ? fighterCopy.wounds : undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(99)
      ]),
      runemarks: new FormControl(fighterCopy ? fighterCopy.runemarks : [], []),
      weapons: new FormArray([], []),
      monsterStatTable: new FormArray([], []),
      points: new FormControl(fighterCopy ? fighterCopy.points : undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(999)
      ]),
      modifiers: new FormControl(fighterCopy ? fighterCopy.modifiers : [], []),
      notes: new FormControl(fighterCopy ? fighterCopy.notes : '', []),
      renown: new FormControl(fighterCopy ? fighterCopy.renown : 0, []),
      icon: new FormControl(fighterCopy ? fighterCopy.icon : undefined, []),
      abilities: new FormControl(fighterCopy ? fighterCopy.modifiers : [], [])
    });
    if (data.fighter) {
      this.addInitialWeapons(data.fighter.weapons);
      this.addInitialMonsterStats(data.fighter.monsterStatTable || []);
      this.existsInStore = this.fighterStore.checkFighter(data.fighter, false);
    } else {
      this.addWeapon();
      this.addMonsterStat();
      this.existsInStore = false;
    }
    this._subscriptions.add(
      this.type.valueChanges.subscribe(() => {
        this.existsInStore = this.fighterStore.checkFighter(
          this.fighterForm.value,
          false
        );
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public get weapons(): FormArray {
    return this.fighterForm.get('weapons') as FormArray;
  }

  public get monsterStats(): FormArray {
    return this.fighterForm.get('monsterStatTable') as FormArray;
  }

  public get runemarks(): AbstractControl {
    return this.fighterForm.get('runemarks') as AbstractControl;
  }

  public get icon(): AbstractControl {
    return this.fighterForm.get('icon') as AbstractControl;
  }

  public get role(): AbstractControl {
    return this.fighterForm.get('role') as AbstractControl;
  }

  public get type(): AbstractControl {
    return this.fighterForm.get('type') as AbstractControl;
  }

  public addWeapon(weapon?: Weapon): FormGroup | void {
    const weaponFromGroup = new FormGroup({
      range: new FormControl(weapon ? weapon.range : undefined, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*(-[1-9]+[0-9]*)*$/)
      ]),
      attacks: new FormControl(weapon ? weapon.attacks : undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(99)
      ]),
      strength: new FormControl(weapon ? weapon.strength : undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(99)
      ]),
      damage: new FormControl(weapon ? weapon.damage : undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(99)
      ]),
      crit: new FormControl(weapon ? weapon.crit : undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(99)
      ])
    });
    this.weapons.push(weaponFromGroup);
  }

  public removeWeapon(index: number): void {
    this.weapons.removeAt(index);
  }

  public addMonsterStat(monsterStats?: MonsterStat): FormGroup | void {
    const monsterStatsFromGroup = new FormGroup({
      minHealth: new FormControl(monsterStats ? monsterStats.minHealth : 1, [
        Validators.required,
        Validators.min(1)
      ]),
      movement: new FormControl(monsterStats ? monsterStats.movement : 1, [
        Validators.required,
        Validators.min(1)
      ]),
      damage: new FormControl(monsterStats ? monsterStats.damage : 1, [
        Validators.required,
        Validators.min(1)
      ]),
      crit: new FormControl(monsterStats ? monsterStats.crit : 1, [
        Validators.required,
        Validators.min(1)
      ])
    });
    this.monsterStats.push(monsterStatsFromGroup);
  }

  public removeMonsterStat(index: number): void {
    this.monsterStats.removeAt(index);
  }

  public addRunemark(event: any): void {
    const value = (event.value || '').trim();
    const runemarks = this.runemarks.value;

    if (value) {
      runemarks.push(value);
    }

    event.chipInput!.clear();
    this.runemarkCtrl.setValue(null);
    this.runemarks.setValue(runemarks);
  }

  public removeRunemark(runemark: string): void {
    const runemarks = this.runemarks.value;
    runemarks.splice(runemarks.indexOf(runemark), 1);
    this.runemarks.setValue(runemarks);
  }

  public addInitialWeapons(weapons: Weapon[]): void {
    weapons.forEach((weapon) => {
      this.addWeapon(weapon);
    });
  }

  public addInitialMonsterStats(stats: MonsterStat[]): void {
    if (stats.length) {
      stats.forEach((stats) => {
        this.addMonsterStat(stats);
      });
    } else {
      this.addMonsterStat();
    }
  }

  public iconValueChange(icon: string): void {
    this.icon.setValue(icon);
  }

  public acceptDialog(): void {
    const fighter = cloneDeep(this.fighterForm.value as Fighter);
    if (
      this.data.storeDialog &&
      !this.data.edit &&
      this.fighterStore.checkFighter(fighter)
    ) {
      return;
    }
    if (fighter.role !== FighterRole.Monster) {
      fighter.monsterStatTable = undefined;
    }
    this.dialogRef.close(this.fighterForm.value);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public storeFighter(): void {
    this.fighterStore.storeFighter(this.cleanFighter(this.fighterForm.value));
    this.existsInStore = true;
  }

  public updateFighter(): void {
    this.fighterStore.updateFighter(this.cleanFighter(this.fighterForm.value));
    this.existsInStore = true;
  }

  public discardFighter(): void {
    this.fighterStore.discardFighter(
      this.fighterStore.getFighterStoreIndex(this.fighterForm.value),
      () => {
        this.existsInStore = false;
      }
    );
  }

  public cleanFighter(original: Fighter): Fighter {
    const fighter = cloneDeep(original);
    return {
      role: fighter.role,
      type: fighter.type,
      movement: fighter.movement,
      toughness: fighter.toughness,
      wounds: fighter.wounds,
      runemarks: fighter.runemarks,
      weapons: fighter.weapons,
      points: fighter.points,
      modifiers: [],
      abilities: []
    };
  }

  public loadFighter(): void {
    this._subscriptions.add(
      this.dialog
        .open(FighterStoreDialogComponent)
        .afterClosed()
        .subscribe((fighter: Fighter) => {
          if (fighter.runemarks) {
            while (this.weapons.length) {
              this.weapons.removeAt(0);
            }
            this.addInitialWeapons(fighter.weapons);
            while (this.monsterStats.length) {
              this.monsterStats.removeAt(0);
            }
            this.addInitialMonsterStats(fighter.monsterStatTable || []);
            this.fighterForm.setValue({
              ...this.fighterForm.value,
              ...fighter
            });
            this.existsInStore = true;
          }
        })
    );
  }
}
