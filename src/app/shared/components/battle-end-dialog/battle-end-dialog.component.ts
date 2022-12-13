import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Battle } from 'src/app/core/models/battle.model';

@Component({
  selector: 'smitd-battle-end-dialog',
  templateUrl: './battle-end-dialog.component.html',
  styleUrls: ['./battle-end-dialog.component.scss']
})
export class BattleEndDialogComponent {
  resultForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BattleEndDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      battle: Battle;
    }
  ) {
    this.resultForm = new FormGroup({
      outcome: new FormControl(null, [Validators.required]),
      enemy: new FormControl(undefined)
    });
  }

  acceptDialog(): void {
    this.dialogRef.close(this.resultForm.value);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
