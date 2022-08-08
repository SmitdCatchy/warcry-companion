import { Component, Input, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AbilityType } from 'src/app/core/enums/ability-type.enum';
import { Battleground } from 'src/app/core/enums/battle-ground.enum';

@Component({
  selector: 'smitd-ability-form',
  templateUrl: './ability-form.component.html',
  styleUrls: ['./ability-form.component.scss']
})
export class AbilityFormComponent {
  @Input() abilityForm: FormGroup;
  @Input() index: number;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public runemarkCtrl = new FormControl('');
  public AbilityTypeList = Object.values(AbilityType);
  public battlegroundList = Object.values(Battleground);

  constructor() {
    this.abilityForm = new FormGroup({});
    this.index = -1;
  }

  public get runemarks(): AbstractControl {
    return this.abilityForm.get('runemarks') as AbstractControl;
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
    console.log('runemarks', runemarks);

    runemarks.splice(runemarks.indexOf(runemark), 1);
    this.runemarks.setValue(runemarks);
  }
}
