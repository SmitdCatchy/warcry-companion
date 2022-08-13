import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Color } from 'src/app/core/enums/color.enum';
import { FighterCardMode } from 'src/app/core/enums/fighter-card-mode.enum';
import { Fighter } from 'src/app/core/models/fighter.model';
import { Warband } from 'src/app/core/models/warband.model';
import { WarbandService } from 'src/app/core/services/warband.service';
import { FighterDialogComponent } from 'src/app/shared/components/fighter-dialog/fighter-dialog.component';
import { Ability } from 'src/app/core/models/ability.model';
import { AbilityType } from 'src/app/core/enums/ability-type.enum';
import { AbilityDialogComponent } from 'src/app/shared/components/ability-dialog/ability-dialog.component';
import cloneDeep from 'lodash.clonedeep';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { BattleService } from 'src/app/core/services/battle.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'smitd-warband-page',
  templateUrl: './warband-page.component.html',
  styleUrls: ['./warband-page.component.scss']
})
export class WarbandPageComponent implements OnDestroy {
  private subscriptions = new Subscription();
  public Color = Color;
  public FighterCardMode = FighterCardMode;
  public colorList = Object.keys(Color).map((key) => ({
    key,
    value: Color[key as keyof typeof Color]
  }));

  public warbandForm: FormGroup;
  public campaignForm: FormGroup;

  constructor(
    public readonly warbandService: WarbandService,
    public readonly battleService: BattleService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService
  ) {
    this.warbandForm = new FormGroup({
      name: new FormControl(this.warband.name, [Validators.required]),
      faction: new FormControl(this.warband.faction, [Validators.required]),
      alliance: new FormControl(this.warband.alliance, [Validators.required]),
      color: new FormControl(this.warband.color, [Validators.required]),
      abilities: new FormArray([]),
      icon: new FormControl(this.warband ? this.warband.icon : undefined, [])
    });
    this.campaignForm = new FormGroup({
      name: new FormControl(this.warband.campaign.name, []),
      limit: new FormControl(this.warband.campaign.limit, []),
      reputation: new FormControl(this.warband.campaign.reputation, []),
      glory: new FormControl(this.warband.campaign.glory, []),
      notes: new FormControl(this.warband.campaign.notes, [])
    });
    this.addInitialAbilities(this.warband.abilities);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get selectedColor(): string {
    return this.warbandForm.get('color')!.value;
  }

  public get warband(): Warband {
    return this.warbandService.selectedWarband;
  }

  public get abilities(): FormArray {
    return this.warbandForm.get('abilities') as FormArray;
  }

  public get abilitiesList(): FormGroup[] {
    return this.abilities.controls as FormGroup[];
  }

  public get icon(): AbstractControl {
    return this.warbandForm.get('icon') as AbstractControl;
  }

  public iconValueChange(icon: string): void {
    this.icon.setValue(icon);
  }

  public updateWarband(): void {
    const editedWarband = { ...this.warband, ...this.warbandForm.value };
    this.warbandService.updateWarband(editedWarband);
  }

  public updateCampaign(): void {
    const editedWarband = {
      ...this.warband,
      campaign: this.campaignForm.value
    };
    this.warbandService.updateWarband(editedWarband);
  }

  public addFighter(): void {
    this.subscriptions.add(
      this.dialog
        .open(FighterDialogComponent, {
          data: {},
          disableClose: true,
          panelClass: ['full-screen-modal']
        })
        .afterClosed()
        .subscribe((fighter) => {
          if (fighter) {
            this.warbandService.addFighter(fighter);
          }
        })
    );
  }

  public editFighter(fighter: Fighter, index: number): void {
    this.subscriptions.add(
      this.dialog
        .open(FighterDialogComponent, {
          data: { fighter, edit: true },
          disableClose: true,
          panelClass: ['full-screen-modal']
        })
        .afterClosed()
        .subscribe((updated) => {
          if (updated) {
            this.warbandService.updateFighter(updated, index);
          }
        })
    );
  }

  public duplicateFighter(fighter: Fighter): void {
    const duplicated = { ...fighter, ...{ name: '', modifiers: [], note: '' } };
    this.subscriptions.add(
      this.dialog
        .open(FighterDialogComponent, {
          data: { fighter: duplicated },
          disableClose: true
        })
        .afterClosed()
        .subscribe((fighter) => {
          if (fighter) {
            this.warbandService.addFighter(fighter);
          }
        })
    );
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
              'warband-page.tab.warband.form.abilities.remove-question',
              {
                ability: this.abilitiesList[index].value.title,
                warband: this.warbandForm.value.name
              }
            )
          }
        })
        .afterClosed()
        .subscribe((decision) => {
          if (decision) {
            this.abilities.removeAt(index);
          }
        })
    );
  }

  public addInitialAbilities(abilities: Ability[]): void {
    abilities.forEach((ability) => {
      this.addAbility(ability);
    });
  }
}
