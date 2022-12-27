import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { COMMA, ENTER, PERIOD } from '@angular/cdk/keycodes';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AbilityType } from 'src/app/core/enums/ability-type.enum';
import { WarbandService } from 'src/app/core/services/warband.service';
import { Battleground } from 'src/app/core/models/battleground.model';
import { map, Observable } from 'rxjs';
import { Runemark } from 'src/app/core/models/runemark.model';
import { RunemarksService } from 'src/app/core/services/runemarks.service';

@Component({
  selector: 'smitd-ability-form',
  templateUrl: './ability-form.component.html',
  styleUrls: ['./ability-form.component.scss']
})
export class AbilityFormComponent {
  @Input() abilityForm: FormGroup;
  @Input() index: number;
  separatorKeysCodes: number[] = [ENTER, COMMA, PERIOD];
  AbilityTypeList = Object.values(AbilityType);
  runemarkCtrl = new FormControl('');
  @ViewChild('runemarkInput')
  private _runemarkInput!: ElementRef<HTMLInputElement>;
  filteredRunemarkList: Observable<Runemark[]>;
  prohibitiveRunemarksCtrl = new FormControl('');
  @ViewChild('prohibitiveRunemarkInput')
  private _prohibitiveRunemarkInput!: ElementRef<HTMLInputElement>;
  filteredProhibitiveRunemarkList: Observable<Runemark[]>;

  constructor(private readonly _runemarksService: RunemarksService) {
    this.abilityForm = new FormGroup({});
    this.index = -1;
    this.filteredRunemarkList = this.runemarkCtrl.valueChanges.pipe(
      map((expression: string | null) =>
        expression
          ? this._filterRunemarkArray(
              expression,
              this._runemarksService.runemarks.slice()
            )
          : this._runemarksService.runemarks.slice()
      )
    );
    this.filteredProhibitiveRunemarkList =
      this.prohibitiveRunemarksCtrl.valueChanges.pipe(
        map((expression: string | null) =>
          expression
            ? this._filterRunemarkArray(
                expression,
                this._runemarksService.runemarks.slice()
              )
            : this._runemarksService.runemarks.slice()
        )
      );
  }

  private _filterRunemarkArray(
    expression: string,
    runemarks: Runemark[]
  ): Runemark[] {
    const filterValue = expression.toLowerCase();

    return runemarks.filter((runemark) =>
      runemark.key.toLowerCase().includes(filterValue)
    );
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
    setTimeout(() => {
      this._runemarkInput.nativeElement.value = '';
      this.runemarkCtrl.setValue(null);
    }, 100);
    this.runemarks.setValue(runemarks);
  }

  selectRunemark(event: any): void {
    let runemarks = this.runemarks.value;
    if (this._runemarkInput.nativeElement.value) {
      runemarks = runemarks.filter(
        (runemark: string) =>
          runemark !== this._runemarkInput.nativeElement.value
      );
    }
    runemarks.push(event.option.value);
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
    setTimeout(() => {
      this._prohibitiveRunemarkInput.nativeElement.value = '';
      this.prohibitiveRunemarksCtrl.setValue(null);
    }, 100);
    this.prohibitiveRunemarks.setValue(runemarks);
  }

  selectProhibitiveRunemark(event: any): void {
    let runemarks = this.prohibitiveRunemarks.value;
    if (this._prohibitiveRunemarkInput.nativeElement.value) {
      runemarks = runemarks.filter(
        (runemark: string) => runemark !== this._prohibitiveRunemarkInput.nativeElement.value
      );
    }
    runemarks.push(event.option.value);
    this.prohibitiveRunemarks.setValue(runemarks);
  }

  removeProhibitiveRunemarks(runemark: string): void {
    const runemarks = this.prohibitiveRunemarks.value;

    runemarks.splice(runemarks.indexOf(runemark), 1);
    this.prohibitiveRunemarks.setValue(runemarks);
  }
}
