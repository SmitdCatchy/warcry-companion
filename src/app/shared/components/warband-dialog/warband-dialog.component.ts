import { Component, Inject, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Color } from 'src/app/core/enums/color.enum';
import { EncampmentState } from 'src/app/core/enums/encampment-state.enum';
import { Warband } from 'src/app/core/models/warband.model';
import { WarbandService } from 'src/app/core/services/warband.service';
import cloneDeep from 'lodash.clonedeep';
import { GrandAlliance } from 'src/app/core/enums/alliances.enum';
import { DataService } from 'src/app/core/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'smitd-warband-dialog',
  templateUrl: './warband-dialog.component.html',
  styleUrls: ['./warband-dialog.component.scss']
})
export class WarbandDialogComponent implements OnDestroy {
  warbandForm: FormGroup;
  alliances = Object.keys(GrandAlliance);
  colorList = Object.keys(Color).map((key) => ({
    key,
    value: Color[key as keyof typeof Color]
  }));
  warbands: Warband[] = [];
  private _subs = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<WarbandDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      warband: Warband;
    },
    private readonly warbandService: WarbandService,
    public readonly dataService: DataService
  ) {
    const warband = cloneDeep(data.warband);
    this.warbandForm = new FormGroup({
      name: new FormControl(warband ? warband.name : '', [Validators.required]),
      faction: new FormControl(warband ? warband.faction : '', [
        Validators.required
      ]),
      alliance: new FormControl(warband ? warband.alliance : '', [
        Validators.required
      ]),
      color: new FormControl(warband ? warband.color : Color.grey, [
        Validators.required
      ]),
      fighters: new FormControl(warband ? warband.fighters : []),
      abilities: new FormControl(warband ? warband.abilities : []),
      campaign: new FormControl(
        warband
          ? warband.campaign
          : {
              name: '',
              quest: '',
              limit: 1000,
              reputation: 2,
              glory: 0,
              progress: 0,
              questProgress: 0,
              notes: '',
              encampment: '',
              encampmentState: EncampmentState.Secure
            }
      ),
      icon: new FormControl(warband ? warband.icon : undefined, [])
    });
    this._subs.add(this.alliance.valueChanges.subscribe((value: GrandAlliance) => {
      this.warbands = this.dataService.getAlliance(value.toLocaleLowerCase() as GrandAlliance);
    }));
    this._subs.add(this.faction.valueChanges.subscribe((value: string) => {
      const selectedWarband = this.warbands.find(
        (check) => check.name === value
      );
      if(selectedWarband) {
        this.warbandForm.get('color')?.setValue(selectedWarband.color);
        this.warbandForm.get('fighters')?.setValue(selectedWarband.fighters);
        this.warbandForm.get('abilities')?.setValue(selectedWarband.abilities);
      }
    }));
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  get selectedColor(): string {
    return this.warbandForm.get('color')!.value;
  }

  get icon(): AbstractControl {
    return this.warbandForm.get('icon') as AbstractControl;
  }

  get alliance(): AbstractControl {
    return this.warbandForm.get('alliance') as AbstractControl;
  }

  get faction(): AbstractControl {
    return this.warbandForm.get('faction') as AbstractControl;
  }

  iconValueChange(icon: string): void {
    this.icon.setValue(icon);
  }

  acceptDialog(): void {
    if (!this.warbandService.checkWarband(this.warbandForm.value)) {
      this.dialogRef.close(this.warbandForm.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
