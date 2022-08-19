import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbilityType } from 'src/app/core/enums/ability-type.enum';
import { Ability } from 'src/app/core/models/ability.model';

@Component({
  selector: 'smitd-ability-dialog',
  templateUrl: './ability-dialog.component.html',
  styleUrls: ['./ability-dialog.component.scss']
})
export class AbilityDialogComponent {
  public abilityForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AbilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      ability: Ability;
      edit: boolean;
    }) {
      this.abilityForm = new FormGroup({
        type: new FormControl(data.ability ? data.ability.type : AbilityType.Double, [
          Validators.required
        ]),
        runemarks: new FormControl(data.ability ? data.ability.runemarks : [], []),
        title: new FormControl(data.ability ? data.ability.title : '', [
          Validators.required
        ]),
        description: new FormControl(data.ability ? data.ability.description : '', [
          Validators.required
        ])
      });
    }


  public acceptDialog(): void {
    this.dialogRef.close(this.abilityForm.value);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}
