import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModifierType } from 'src/app/core/enums/modifier-type.enum';
import { Modifier } from 'src/app/core/models/modifier.model';

@Component({
  selector: 'smitd-modifier-dialog',
  templateUrl: './modifier-dialog.component.html',
  styleUrls: ['./modifier-dialog.component.scss']
})
export class ModifierDialogComponent {
  modifierForm: FormGroup;
  ModifierTypeList = Object.values(ModifierType);

  constructor(
    public dialogRef: MatDialogRef<ModifierDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      modifier: Modifier;
      edit: boolean;
    }
  ) {
    this.modifierForm = new FormGroup({
      name: new FormControl(data.modifier ? data.modifier.name : '', [Validators.required]),
      type: new FormControl(data.modifier ? data.modifier.type : ModifierType.Artefact, [Validators.required]),
      description: new FormControl(data.modifier ? data.modifier.description : '', [Validators.required]),
      usable: new FormControl(data.modifier ? data.modifier.description : false, [Validators.required]),
      used: new FormControl(false, [Validators.required]),
      attribute: new FormControl(data.modifier ? data.modifier.attribute : '', []),
      modify: new FormGroup({
        weapon: new FormGroup({
          ranged: new FormControl(data.modifier ? data.modifier.modify.weapon.ranged : false, [Validators.required]),
          attacks: new FormControl(data.modifier ? data.modifier.modify.weapon.attacks : 0, [Validators.required]),
          strength: new FormControl(data.modifier ? data.modifier.modify.weapon.strength : 0, [Validators.required]),
          damage: new FormControl(data.modifier ? data.modifier.modify.weapon.damage : 0, [Validators.required]),
          crit: new FormControl(data.modifier ? data.modifier.modify.weapon.crit : 0, [Validators.required])
        }),
        movement: new FormControl(data.modifier ? data.modifier.modify.movement : 0, [Validators.required]),
        toughness: new FormControl(data.modifier ? data.modifier.modify.toughness : 0, [Validators.required]),
        wounds: new FormControl(data.modifier ? data.modifier.modify.wounds : 0, [Validators.required])
      })
    });
  }

  get modify(): FormGroup {
    return this.modifierForm.get('modify') as FormGroup;
  }

  get weapon(): FormGroup {
    return this.modify.get('weapon') as FormGroup;
  }

  acceptDialog(): void {
    this.dialogRef.close(this.modifierForm.value);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
