import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Color } from 'src/app/core/enums/color.enum';

@Component({
  selector: 'smitd-warband-dialog',
  templateUrl: './warband-dialog.component.html',
  styleUrls: ['./warband-dialog.component.scss']
})
export class WarbandDialogComponent {
  public warbandForm: FormGroup;
  public colorList = Object.keys(Color).map((key) => ({
    key,
    value: Color[key as keyof typeof Color]
  }));

  constructor(
    public dialogRef: MatDialogRef<WarbandDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {}
  ) {
    this.warbandForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      faction: new FormControl('', [Validators.required]),
      alliance: new FormControl('', [Validators.required]),
      color: new FormControl(Color.grey, [Validators.required]),
      fighters: new FormControl([]),
      abilities: new FormControl([]),
      campaign: new FormControl({
        name: '',
        limit: 1000,
        reputation: 2,
        glory: 0,
        notes: ''
      })
    });
  }

  public get selectedColor(): string {
    return this.warbandForm.get('color')!.value;
  }

  public acceptDialog(): void {
    this.dialogRef.close(this.warbandForm.value);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}
