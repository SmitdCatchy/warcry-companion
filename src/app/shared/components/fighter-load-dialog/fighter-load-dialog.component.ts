import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import cloneDeep from 'lodash.clonedeep';
import { Subscription } from 'rxjs';
import { GrandAlliance } from 'src/app/core/enums/alliances.enum';
import { Ability } from 'src/app/core/models/ability.model';
import { Fighter } from 'src/app/core/models/fighter.model';
import { Warband } from 'src/app/core/models/warband.model';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'smitd-fighter-load-dialog',
  templateUrl: './fighter-load-dialog.component.html',
  styleUrls: ['./fighter-load-dialog.component.scss']
})
export class FighterLoadDialogComponent {
  fighterForm: FormGroup;
  alliances = Object.keys(GrandAlliance);
  factions: Warband[] = [];
  abilities: Ability[] = [];
  fighters: Fighter[] = [];
  private _subs = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<FighterLoadDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      warband: Warband;
    },
    public readonly dataService: DataService
  ) {
    this.fighterForm = new FormGroup({
      alliance: new FormControl(this.data.warband.alliance, [Validators.required]),
      faction: new FormControl(this.data.warband.faction, [Validators.required]),
      fighter: new FormControl(undefined, [Validators.required])
    });
    this._setFactions(this.data.warband.alliance as GrandAlliance);
    this._setFighters(this.data.warband.faction);
    this._subs.add(
      this.alliance.valueChanges.subscribe((value: GrandAlliance) => {
        this._setFactions(value);
      })
    );
    this._subs.add(
      this.faction.valueChanges.subscribe((value: string) => {
        this._setFighters(value);
      })
    );
  }

  private _setFactions(alliance: GrandAlliance): void {
    this.factions = this.dataService.getAlliance(
      alliance.toLocaleLowerCase() as GrandAlliance
    );
  }

  private _setFighters(faction: string): void {
    const warband = this.dataService.getWarband(faction);
    this.abilities = warband?.abilities || [];
    this.fighters = warband?.fighters || [];
  }

  get alliance(): AbstractControl {
    return this.fighterForm.get('alliance') as AbstractControl;
  }

  get faction(): AbstractControl {
    return this.fighterForm.get('faction') as AbstractControl;
  }

  get fighter(): AbstractControl {
    return this.fighterForm.get('fighter') as AbstractControl;
  }

  acceptDialog(): void {
    const fighter = cloneDeep(this.fighter.value as Fighter);
    this.dialogRef.close({ fighter, abilities: this.abilities });
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
