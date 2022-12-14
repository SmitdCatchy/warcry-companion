import { Component, Input } from '@angular/core';
import { COMMA, ENTER, PERIOD } from '@angular/cdk/keycodes';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AbilityType } from 'src/app/core/enums/ability-type.enum';
import { WarbandService } from 'src/app/core/services/warband.service';
import { Battleground } from 'src/app/core/models/battleground.model';

@Component({
  selector: 'smitd-ability-form',
  templateUrl: './ability-form.component.html',
  styleUrls: ['./ability-form.component.scss']
})
export class AbilityFormComponent {
  @Input() abilityForm: FormGroup;
  @Input() index: number;
  separatorKeysCodes: number[] = [ENTER, COMMA, PERIOD];
  runemarkCtrl = new FormControl('');
  prohibitiveRunemarksCtrl = new FormControl('');
  AbilityTypeList = Object.values(AbilityType);

  constructor(private warbandService: WarbandService) {
    this.abilityForm = new FormGroup({});
    this.index = -1;
  }

  get runemarks(): AbstractControl {
    return this.abilityForm.get('runemarks') as AbstractControl;
  }

  get prohibitiveRunemarks(): AbstractControl {
    return this.abilityForm.get('prohibitiveRunemarks') as AbstractControl;
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

  addProhibitiveRunemarks(event: any): void {
    const value = (event.value || '').trim();
    const runemarks = this.prohibitiveRunemarks.value;

    if (value) {
      runemarks.push(value);
    }

    event.chipInput!.clear();
    this.prohibitiveRunemarksCtrl.setValue(null);
    this.prohibitiveRunemarks.setValue(runemarks);
  }

  removeProhibitiveRunemarks(runemark: string): void {
    const runemarks = this.prohibitiveRunemarks.value;

    runemarks.splice(runemarks.indexOf(runemark), 1);
    this.prohibitiveRunemarks.setValue(runemarks);
  }
}
