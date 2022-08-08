import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'smitd-ability-dialog',
  templateUrl: './ability-dialog.component.html',
  styleUrls: ['./ability-dialog.component.scss']
})
export class AbilityDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AbilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      abilityForm: FormGroup;
      edit: boolean;
    }) { }

  ngOnInit(): void {
  }


  public acceptDialog(): void {
    this.dialogRef.close(this.data.abilityForm.value);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}
