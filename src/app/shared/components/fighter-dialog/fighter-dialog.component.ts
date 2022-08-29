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
import { Warband } from 'src/app/core/models/warband.model';
import { TranslateService } from '@ngx-translate/core';

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
      warband: Warband;
      edit: boolean;
      storeDialog: boolean;
    },
    public readonly fighterStore: FighterStoreService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService
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
      abilities: new FormControl(fighterCopy ? fighterCopy.abilities : [], []),
      faction: new FormControl(
        data.warband
          ? data.warband.faction
          : fighterCopy
          ? fighterCopy.faction
          : this.translateService.instant('common.unaligned'),
        data.storeDialog ? [Validators.required] : []
      )
    });
    if (data.storeDialog && data.edit) {
      this.type.disable();
      this.faction.disable();
    }
    if (data.fighter) {
      this.addInitialWeapons(data.fighter.weapons);
      this.addInitialMonsterStats(data.fighter.monsterStatTable || []);
      this.existsInStore = this.fighterStore.checkFighter(data.fighter, false);
    } else {
      this.addWeapon();
      this.addMonsterStat();
      this.existsInStore = false;
    }
    if (!data.storeDialog) {
      this._subscriptions.add(
        this.type.valueChanges.subscribe(() => {
          this.existsInStore = this.fighterStore.checkFighter(
            this.fighterForm.value,
            false
          );
        })
      );
    }
    this._subscriptions.add(
      this.role.valueChanges.subscribe((role) => {
        this.setRoleRunemarks(role);
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

  public get faction(): AbstractControl {
    return this.fighterForm.get('faction') as AbstractControl;
  }

  public get abilities(): AbstractControl {
    return this.fighterForm.get('abilities') as AbstractControl;
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
    this.type.enable();
    this.faction.enable();
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
    this.fighterStore.discardFighter(this.fighterForm.value, () => {
      this.existsInStore = false;
    });
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
      faction: fighter.faction,
      modifiers: [],
      abilities: fighter.abilities,
      monsterStatTable: fighter.monsterStatTable
    };
  }

  public loadFighter(): void {
    this._subscriptions.add(
      this.dialog
        .open(FighterStoreDialogComponent)
        .afterClosed()
        .subscribe((fighter: Fighter) => {
          if (fighter.runemarks) {
            this.weapons.clear()
            this.addInitialWeapons(fighter.weapons);
            this.monsterStats.clear();
            this.addInitialMonsterStats(fighter.monsterStatTable || []);
            this.fighterForm.setValue({
              ...this.fighterForm.value,
              ...fighter
            });
            console.log('Loaded', this.fighterForm.value);
            this.existsInStore = true;
          }
        })
    );
  }

  private setRoleRunemarks(role: FighterRole): void {
    const runemarksSet = new Set(this.runemarks.value);
    switch (role) {
      case FighterRole.Thrall:
        runemarksSet.add(this.translateService.instant('fighter-role.thrall'));
        runemarksSet.delete(this.translateService.instant('fighter-role.hero'));
        runemarksSet.delete(
          this.translateService.instant('fighter-role.monster')
        );
        runemarksSet.delete(this.translateService.instant('fighter-role.ally'));
        this.runemarks.setValue([...runemarksSet]);
        break;
      default:
        this.fighterRoleList.forEach((role) => {
          runemarksSet.delete(
            this.translateService.instant(`fighter-role.${role}`)
          );
        });
        runemarksSet.add(this.translateService.instant(`fighter-role.${role}`));
        if (
          role !== FighterRole.Ally &&
          role !== FighterRole.Monster
        ) {
          this.abilities.setValue([]);
        }
        this.runemarks.setValue([...runemarksSet]);
        break;
    }
    this.runemarks.setValue;
  }
}
