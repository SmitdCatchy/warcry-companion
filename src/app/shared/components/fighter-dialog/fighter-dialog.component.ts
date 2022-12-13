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
import { Color } from 'src/app/core/enums/color.enum';

@Component({
  selector: 'smitd-fighter-dialog',
  templateUrl: './fighter-dialog.component.html',
  styleUrls: ['./fighter-dialog.component.scss']
})
export class FighterDialogComponent implements OnDestroy {
  fighterForm: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA, PERIOD];
  runemarkCtrl = new FormControl('');
  fighterRoleList = Object.values(FighterRole);
  FighterRole = FighterRole;
  existsInStore: boolean;
  private _subscriptions: Subscription = new Subscription();
  colorList = Object.keys(Color).map((key) => ({
    key,
    value: Color[key as keyof typeof Color]
  }));

  constructor(
    public dialogRef: MatDialogRef<FighterDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      fighter: Fighter;
      warband: Warband;
      edit: boolean;
      storeDialog: boolean;
    },
    readonly fighterStore: FighterStoreService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService
  ) {
    if(data.warband) {
      this.colorList.unshift({key: 'warband', value: data.warband.color});
    }
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
      ),
      color: new FormControl(
        fighterCopy?.color ? fighterCopy.color : data.warband.color
      )
    });
    console.log(
      fighterCopy?.color ? fighterCopy.color : data.warband.color
    );
    console.log(fighterCopy);
    console.log(data.warband);

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
      this.role.valueChanges.subscribe((role: FighterRole) => {
        this.setRoleRunemarks(role);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  get weapons(): FormArray {
    return this.fighterForm.get('weapons') as FormArray;
  }

  get monsterStats(): FormArray {
    return this.fighterForm.get('monsterStatTable') as FormArray;
  }

  get runemarks(): AbstractControl {
    return this.fighterForm.get('runemarks') as AbstractControl;
  }

  get icon(): AbstractControl {
    return this.fighterForm.get('icon') as AbstractControl;
  }

  get role(): AbstractControl {
    return this.fighterForm.get('role') as AbstractControl;
  }

  get type(): AbstractControl {
    return this.fighterForm.get('type') as AbstractControl;
  }

  get faction(): AbstractControl {
    return this.fighterForm.get('faction') as AbstractControl;
  }

  get abilities(): AbstractControl {
    return this.fighterForm.get('abilities') as AbstractControl;
  }

  get selectedColor(): string {
    return this.fighterForm.get('color')!.value;
  }

  addWeapon(weapon?: Weapon): FormGroup | void {
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

  removeWeapon(index: number): void {
    this.weapons.removeAt(index);
  }

  addMonsterStat(monsterStats?: MonsterStat): FormGroup | void {
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

  removeMonsterStat(index: number): void {
    this.monsterStats.removeAt(index);
  }

  addRunemark(event: any): void {
    const value = (event.value || '').trim();
    const runemarks = this.runemarks.value;

    if (value) {
      runemarks.push(value);
    }

    event.chipInput!.clear();
    this.runemarkCtrl.setValue(null);
    this.runemarks.setValue(runemarks);
  }

  removeRunemark(runemark: string): void {
    const runemarks = this.runemarks.value;
    runemarks.splice(runemarks.indexOf(runemark), 1);
    this.runemarks.setValue(runemarks);
  }

  addInitialWeapons(weapons: Weapon[]): void {
    weapons.forEach((weapon) => {
      this.addWeapon(weapon);
    });
  }

  addInitialMonsterStats(stats: MonsterStat[]): void {
    if (stats.length) {
      stats.forEach((stats) => {
        this.addMonsterStat(stats);
      });
    } else {
      this.addMonsterStat();
    }
  }

  iconValueChange(icon: string): void {
    this.icon.setValue(icon);
  }

  acceptDialog(): void {
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

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  storeFighter(): void {
    this.fighterStore.storeFighter(this.cleanFighter(this.fighterForm.value));
    this.existsInStore = true;
  }

  updateFighter(): void {
    this.fighterStore.updateFighter(this.cleanFighter(this.fighterForm.value));
    this.existsInStore = true;
  }

  discardFighter(): void {
    this.fighterStore.discardFighter(this.fighterForm.value, () => {
      this.existsInStore = false;
    });
  }

  cleanFighter(original: Fighter): Fighter {
    const fighter = cloneDeep(original);
    return {
      role:
        fighter.role === FighterRole.Leader ? FighterRole.Hero : fighter.role,
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
      monsterStatTable: fighter.monsterStatTable,
      icon: fighter.icon,
      color: this.data.warband ? this.data.warband.color : undefined
    };
  }

  loadFighter(): void {
    this._subscriptions.add(
      this.dialog
        .open(FighterStoreDialogComponent)
        .afterClosed()
        .subscribe((fighter: Fighter) => {
          if (fighter.runemarks) {
            this.weapons.clear();
            this.addInitialWeapons(fighter.weapons);
            this.monsterStats.clear();
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

  private setRoleRunemarks(role: FighterRole): void {
    const runemarksSet = new Set(this.runemarks.value);
    switch (role) {
      case FighterRole.Fighter:
        runemarksSet.delete(
          this.translateService.instant('fighter-role.thrall')
        );
        runemarksSet.delete(this.translateService.instant('fighter-role.hero'));
        runemarksSet.delete(
          this.translateService.instant('fighter-role.monster')
        );
        runemarksSet.delete(this.translateService.instant('fighter-role.ally'));
        this.runemarks.setValue([...runemarksSet]);
        break;
      case FighterRole.Thrall:
        runemarksSet.add(this.translateService.instant('fighter-role.thrall'));
        runemarksSet.delete(this.translateService.instant('fighter-role.hero'));
        runemarksSet.delete(
          this.translateService.instant('fighter-role.monster')
        );
        runemarksSet.delete(this.translateService.instant('fighter-role.ally'));
        this.runemarks.setValue([...runemarksSet]);
        break;
      case FighterRole.Leader:
        runemarksSet.add(this.translateService.instant('fighter-role.hero'));
        runemarksSet.delete(
          this.translateService.instant('fighter-role.thrall')
        );
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
        if (role !== FighterRole.Ally && role !== FighterRole.Monster) {
          this.abilities.setValue([]);
        }
        this.runemarks.setValue([...runemarksSet]);
        break;
    }
    this.runemarks.setValue;
  }
}
