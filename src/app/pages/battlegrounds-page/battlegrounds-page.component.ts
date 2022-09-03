import { Component, OnDestroy } from '@angular/core';
import { BattlegroundsService } from 'src/app/core/services/battlegrounds.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Subscription, filter, debounceTime } from 'rxjs';
import { Ability } from 'src/app/core/models/ability.model';
import { AbilityType } from 'src/app/core/enums/ability-type.enum';
import { AbilityDialogComponent } from 'src/app/shared/components/ability-dialog/ability-dialog.component';
import { Battleground } from 'src/app/core/models/battleground.model';
import { WarbandService } from 'src/app/core/services/warband.service';
import { CoreService } from 'src/app/core/services/core.service';

export const battlegroundsFileType = 'battlegrounds';

@Component({
  selector: 'smitd-battlegrounds-page',
  templateUrl: './battlegrounds-page.component.html',
  styleUrls: ['./battlegrounds-page.component.scss']
})
export class BattlegroundsPageComponent implements OnDestroy {
  private _subscriptions = new Subscription();
  public battlegroundForm: FormGroup;
  public selectedBattlegroundIndex: number;

  constructor(
    public readonly core: CoreService,
    public readonly battlegroundsService: BattlegroundsService,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog
  ) {
    this.battlegroundForm = new FormGroup({
      name: new FormControl(this.battlegroundsService.universalAbilities.name, [
        Validators.required
      ]),
      abilities: new FormArray([]),
      universal: new FormControl(
        this.battlegroundsService.universalAbilities.universal
      )
    });
    this.selectedBattlegroundIndex = 0;
    this.addInitialAbilities(
      this.battlegroundsService.universalAbilities.abilities
    );
    this.battlegroundForm.markAsUntouched();
    this._subscriptions.add(
      this.battlegroundForm.valueChanges
        .pipe(
          filter(() => this.battlegroundForm.valid),
          debounceTime(400)
        )
        .subscribe(() => {
          this.updateBattleground();
        })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public get abilities(): FormArray {
    return this.battlegroundForm.get('abilities') as FormArray;
  }

  public get abilitiesList(): FormGroup[] {
    return this.abilities.controls as FormGroup[];
  }

  public get universal(): AbstractControl {
    return this.battlegroundForm.get('universal') as AbstractControl;
  }

  public get name(): AbstractControl {
    return this.battlegroundForm.get('name') as AbstractControl;
  }

  public selectBattleground(index: number): void {
    this.selectedBattlegroundIndex = index;
    const selected = this.battlegroundsService.battlegrounds[index];
    this.name.setValue(selected.name);
    this.universal.setValue(selected.universal);
    while (this.abilities.length !== 0) {
      this.abilities.removeAt(0);
    }
    this.addInitialAbilities(selected.abilities);
    this.battlegroundForm.markAsUntouched();
  }

  public addNewBattleground(
    battleground?: Battleground,
    select: boolean = true
  ): void {
    this.battlegroundsService.addBattleground(
      battleground || {
        name: this.translateService.instant(
          'battlegrounds-page.battleground.new'
        ),
        abilities: [],
        universal: false
      }
    );
    if (select) {
      this.selectBattleground(
        this.battlegroundsService.battlegrounds.length - 1
      );
    }
  }

  public updateBattleground(): void {
    this.battlegroundsService.editBattleground(
      this.selectedBattlegroundIndex,
      this.battlegroundForm.value
    );
    this.battlegroundForm.markAsUntouched();
  }

  public removeBattleground(): void {
    this._subscriptions.add(
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            yesColor: 'warn',
            question: this.translateService.instant(
              'battlegrounds-page.dialog.battleground.remove',
              {
                battleground:
                  this.battlegroundsService.battlegrounds[
                    this.selectedBattlegroundIndex
                  ].name
              }
            )
          },
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((decision) => {
          if (decision) {
            this.battlegroundsService.removeBattleground(
              this.selectedBattlegroundIndex
            );
            this.selectBattleground(0);
          }
        })
    );
  }

  public addAbility(ability?: Ability, sort: boolean = true): FormGroup | void {
    const abilityFormGroup = new FormGroup({
      type: new FormControl(ability ? ability.type : AbilityType.Double, [
        Validators.required
      ]),
      runemarks: new FormControl(ability ? ability.runemarks : [], []),
      prohibitiveRunemarks: new FormControl(
        ability ? ability.prohibitiveRunemarks : [],
        []
      ),
      title: new FormControl(ability ? ability.title : '', [
        Validators.required
      ]),
      description: new FormControl(ability ? ability.description : '', [
        Validators.required
      ])
    });
    this.abilities.push(abilityFormGroup);
    this.battlegroundForm.markAsTouched();
    if (sort) {
      const abilities = this.abilities.value as Ability[];
      this.abilities.clear();
      this.addInitialAbilities(WarbandService.sortAbilities(abilities));
    }
  }

  public addNewAbility(ability?: Ability): FormGroup | void {
    this._subscriptions.add(
      this.dialog
        .open(AbilityDialogComponent, {
          data: { ability },
          disableClose: true,
          panelClass: ['full-screen-modal'],
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((abilityFormValue) => {
          if (abilityFormValue) {
            this.addAbility(abilityFormValue);
            this.battlegroundForm.markAsTouched();
          }
        })
    );
  }

  public editAbility(index: number) {
    this._subscriptions.add(
      this.dialog
        .open(AbilityDialogComponent, {
          data: { ability: this.abilitiesList[index].value, edit: true },
          disableClose: true,
          panelClass: ['full-screen-modal'],
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((abilityFormValue) => {
          if (abilityFormValue) {
            this.abilitiesList[index].setValue(abilityFormValue);
            this.battlegroundForm.markAsTouched();
            const abilities = this.abilities.value as Ability[];
            this.abilities.clear();
            this.addInitialAbilities(WarbandService.sortAbilities(abilities));
          }
        })
    );
  }

  public removeAbility(index: number): void {
    this._subscriptions.add(
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            yesColor: 'warn',
            question: this.translateService.instant(
              'battlegrounds-page.abilities.remove',
              {
                ability: this.abilitiesList[index].value.title,
                battleground: this.universal.value
                  ? this.translateService.instant(
                      'battlegrounds-page.menu.battlegrounds.universal'
                    )
                  : this.battlegroundForm.value.name
              }
            )
          },
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe((decision) => {
          if (decision) {
            this.abilities.removeAt(index);
            this.battlegroundForm.markAsTouched();
          }
        })
    );
  }

  public addInitialAbilities(abilities: Ability[]): void {
    abilities.forEach((ability) => {
      this.addAbility(ability, false);
    });
  }

  public importBattlegrounds(): void {
    this.core.handleFileUpload(
      (result) => {
        const battlegrounds = result.battlegrounds as Battleground[];
        battlegrounds.forEach((battleground) => {
          this.battlegroundsService.uploadBattleground(battleground);
        });
        this.selectBattleground(0);
        this.dialog.open(ConfirmDialogComponent, {
          data: {
            confirmation: true,
            noLabel: this.translateService.instant('common.ok'),
            question: this.translateService.instant('import.success')
          },
          closeOnNavigation: false
        });
      },
      'json',
      battlegroundsFileType
    );
  }

  public exportBattlegrounds(): void {
    const filename = `battlegrounds.json`;
    const jsonStr = JSON.stringify({
      type: 'battlegrounds',
      battlegrounds: this.battlegroundsService.battlegrounds
    });
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
}
