import { Component, OnDestroy } from '@angular/core';
import { Ability } from 'src/app/core/models/ability.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AbilityType } from 'src/app/core/enums/ability-type.enum';
import { WarbandService } from 'src/app/core/services/warband.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AbilityDialogComponent } from 'src/app/shared/components/ability-dialog/ability-dialog.component';
import cloneDeep from 'lodash.clonedeep';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'smitd-universal-settings-page',
  templateUrl: './universal-settings-page.component.html',
  styleUrls: ['./universal-settings-page.component.scss']
})
export class UniversalSettingsPageComponent implements OnDestroy {
  public universalForm: FormGroup;
  private subscriptions = new Subscription();

  constructor(
    private readonly warbandService: WarbandService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService
  ) {
    this.universalForm = new FormGroup({
      abilities: new FormArray([])
    });
    this.addInitialAbilities(this.universalAbilities);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get universalAbilities(): Ability[] {
    return this.warbandService.universalAbilities;
  }

  public get abilities(): FormArray {
    return this.universalForm.get('abilities') as FormArray;
  }

  public get abilitiesList(): FormGroup[] {
    return this.abilities.controls as FormGroup[];
  }

  public addAbility(ability?: Ability): FormGroup | void {
    const abilityFormGroup = new FormGroup({
      type: new FormControl(ability ? ability.type : AbilityType.Double, [
        Validators.required
      ]),
      runemarks: new FormControl(ability ? ability.runemarks : [], []),
      title: new FormControl(ability ? ability.title : '', [
        Validators.required
      ]),
      description: new FormControl(ability ? ability.description : '', [
        Validators.required
      ]),
      restrictions: new FormControl(ability ? ability.restrictions : [], [])
    });
    this.abilities.push(abilityFormGroup);
  }

  public addNewAbility(ability?: Ability): FormGroup | void {
    const abilityForm = new FormGroup({
      type: new FormControl(ability ? ability.type : AbilityType.Double, [
        Validators.required
      ]),
      runemarks: new FormControl(ability ? ability.runemarks : [], []),
      title: new FormControl(ability ? ability.title : '', [
        Validators.required
      ]),
      description: new FormControl(ability ? ability.description : '', [
        Validators.required
      ]),
      restrictions: new FormControl(ability ? ability.restrictions : [], [])
    });

    this.subscriptions.add(
      this.dialog
        .open(AbilityDialogComponent, {
          data: { abilityForm },
          disableClose: true,
          panelClass: ['full-screen-modal']
        })
        .afterClosed()
        .subscribe((abilityFormValue) => {
          if (abilityFormValue) {
            this.abilities.push(abilityForm);
            this.warbandService.addUniversalAbility(abilityFormValue);
          }
        })
    );
  }

  public editAbility(index: number) {
    const abilityForm = cloneDeep(this.abilitiesList[index]);

    this.subscriptions.add(
      this.dialog
        .open(AbilityDialogComponent, {
          data: { abilityForm, edit: true },
          disableClose: true,
          panelClass: ['full-screen-modal']
        })
        .afterClosed()
        .subscribe((abilityFormValue) => {
          if (abilityFormValue) {
            this.abilitiesList[index].setValue(abilityFormValue);
            this.warbandService.editUniversalAbility(abilityFormValue, index);
          }
        })
    );
  }

  public removeAbility(index: number): void {
    this.subscriptions.add(
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            yesColor: 'warn',
            question: this.translateService.instant(
              'universal-page.abilities.remove-question',
              { ability: this.abilitiesList[index].value.title }
            )
          }
        })
        .afterClosed()
        .subscribe((decision) => {
          if (decision) {
            this.abilities.removeAt(index);
            this.warbandService.removeUniversalAbility(index);
          }
        })
    );
  }

  public addInitialAbilities(abilities: Ability[]): void {
    abilities.forEach((ability) => {
      this.addAbility(ability);
    });
  }

  public exportAbilities(): void {
    const filename = `${this.translateService.instant(
      'universal-page.abilities.export'
    )}.json`;
    const jsonStr = JSON.stringify(this.universalAbilities);
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  public importAbilities(): void {
    const upload: HTMLInputElement = document.createElement('input');
    upload.type = 'file';
    upload.style.display = 'none';
    document.body.appendChild(upload);
    upload.addEventListener('change', () => {
      if ((upload as any).files.length > 0) {
        const reader: FileReader = new FileReader();
        reader.addEventListener('load', () => {
          const abilities = JSON.parse((reader as any).result) as Ability[];
          abilities.forEach((ability) => {
            this.warbandService.addUniversalAbility(ability);
            this.addAbility(ability);
          });
        });
        reader.readAsText((upload as any).files[0]);
      }
    });
    upload.click();
    document.body.removeChild(upload);
  }
}
