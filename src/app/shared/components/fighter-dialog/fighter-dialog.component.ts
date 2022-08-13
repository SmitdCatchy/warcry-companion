import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FighterRole } from 'src/app/core/enums/fighter-role.enum';
import { Fighter } from 'src/app/core/models/fighter.model';
import { Weapon } from 'src/app/core/models/weapon.model';

@Component({
  selector: 'smitd-fighter-dialog',
  templateUrl: './fighter-dialog.component.html',
  styleUrls: ['./fighter-dialog.component.scss']
})
export class FighterDialogComponent {
  public fighterForm: FormGroup;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public runemarkCtrl = new FormControl('');
  public fighterRoleList = Object.values(FighterRole);

  constructor(
    public dialogRef: MatDialogRef<FighterDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      fighter: Fighter;
      edit: boolean;
    }
  ) {

    this.fighterForm = new FormGroup({
      name: new FormControl(data.fighter ? data.fighter.name : '', []),
      role: new FormControl(
        data.fighter ? data.fighter.role : FighterRole.Fighter,
        [Validators.required]
      ),
      type: new FormControl(data.fighter ? data.fighter.type : '', [
        Validators.required
      ]),
      movement: new FormControl(
        data.fighter ? data.fighter.movement : undefined,
        [Validators.required, Validators.min(1)]
      ),
      toughness: new FormControl(
        data.fighter ? data.fighter.toughness : undefined,
        [Validators.required, Validators.min(1)]
      ),
      wounds: new FormControl(data.fighter ? data.fighter.wounds : undefined, [
        Validators.required,
        Validators.min(1)
      ]),
      runemarks: new FormControl(
        data.fighter ? data.fighter.runemarks : [],
        []
      ),
      weapons: new FormArray([], []),
      points: new FormControl(data.fighter ? data.fighter.points : undefined, [
        Validators.required
      ]),
      modifiers: new FormControl([], []),
      note: new FormControl('', []),
      icon: new FormControl(data.fighter ? data.fighter.icon : undefined, []),
    });
    if (data.fighter) {
      this.addInitialWeapons(data.fighter.weapons);
    } else {
      this.addWeapon();
    }
  }

  public get weapons(): FormArray {
    return this.fighterForm.get('weapons') as FormArray;
  }

  public get runemarks(): AbstractControl {
    return this.fighterForm.get('runemarks') as AbstractControl;
  }

  public get icon(): AbstractControl {
    return this.fighterForm.get('icon') as AbstractControl;
  }

  public addWeapon(weapon?: Weapon): FormGroup | void {
    const weaponFromGroup = new FormGroup({
      range: new FormControl(weapon ? weapon.range : undefined, [
        Validators.required
      ]),
      attacks: new FormControl(weapon ? weapon.attacks : undefined, [
        Validators.required,
        Validators.min(1)
      ]),
      strength: new FormControl(weapon ? weapon.strength : undefined, [
        Validators.required,
        Validators.min(1)
      ]),
      damage: new FormControl(weapon ? weapon.damage : undefined, [
        Validators.required,
        Validators.min(1)
      ]),
      crit: new FormControl(weapon ? weapon.crit : undefined, [
        Validators.required,
        Validators.min(1)
      ])
    });
    this.weapons.push(weaponFromGroup);
  }

  public removeWeapon(index: number): void {
    this.weapons.removeAt(index);
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

  public iconValueChange(icon: string): void {
    this.icon.setValue(icon);
  }

  public acceptDialog(): void {
    this.dialogRef.close(this.fighterForm.value);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}
