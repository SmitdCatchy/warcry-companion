import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Color } from 'src/app/core/enums/color.enum';
import { EncampmentState } from 'src/app/core/enums/encampment-state.enum';
import { Warband } from 'src/app/core/models/warband.model';
import { WarbandService } from 'src/app/core/services/warband.service';

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
    public data: {
      warband: Warband;
    },
    private readonly warbandService: WarbandService
  ) {
    this.warbandForm = new FormGroup({
      name: new FormControl(data.warband ? data.warband.name : '', [
        Validators.required
      ]),
      faction: new FormControl(data.warband ? data.warband.faction : '', [
        Validators.required
      ]),
      alliance: new FormControl(data.warband ? data.warband.alliance : '', [
        Validators.required
      ]),
      color: new FormControl(data.warband ? data.warband.color : Color.grey, [
        Validators.required
      ]),
      fighters: new FormControl(data.warband ? data.warband.fighters : []),
      abilities: new FormControl(data.warband ? data.warband.abilities : []),
      campaign: new FormControl(
        data.warband
          ? data.warband.campaign
          : {
              name: '',
              limit: 1000,
              reputation: 2,
              glory: 0,
              progress: 0,
              notes: '',
              encampment: '',
              encampmentState: EncampmentState.Secure
            }
      ),
      icon: new FormControl(data.warband ? data.warband.icon : undefined, []),
    });
  }

  public get selectedColor(): string {
    return this.warbandForm.get('color')!.value;
  }

  public get icon(): AbstractControl {
    return this.warbandForm.get('icon') as AbstractControl;
  }

  public iconValueChange(icon: string): void {
    this.icon.setValue(icon);
  }

  public acceptDialog(): void {
    if (!this.warbandService.checkWarband(this.warbandForm.value)) {
      this.dialogRef.close(this.warbandForm.value);
    }
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}
