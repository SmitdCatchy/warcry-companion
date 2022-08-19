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
import { Subscription } from 'rxjs';
import { Ability } from 'src/app/core/models/ability.model';
import { AbilityType } from 'src/app/core/enums/ability-type.enum';
import { AbilityDialogComponent } from 'src/app/shared/components/ability-dialog/ability-dialog.component';
import { Battleground } from 'src/app/core/models/battleground.model';

@Component({
  selector: 'smitd-battlegrounds-page',
  templateUrl: './battlegrounds-page.component.html',
  styleUrls: ['./battlegrounds-page.component.scss']
})
export class BattlegroundsPageComponent implements OnDestroy {
  private subscriptions = new Subscription();
  public battlegroundForm: FormGroup;
  public selectedBattlegroundIndex: number;

  constructor(
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
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
    this.subscriptions.add(
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
          }
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
      ])
    });
    this.abilities.push(abilityFormGroup);
    this.battlegroundForm.markAsTouched();
  }

  public addNewAbility(ability?: Ability): FormGroup | void {
    this.subscriptions.add(
      this.dialog
        .open(AbilityDialogComponent, {
          data: { ability },
          disableClose: true,
          panelClass: ['full-screen-modal']
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
    this.subscriptions.add(
      this.dialog
        .open(AbilityDialogComponent, {
          data: { ability: this.abilitiesList[index].value, edit: true },
          disableClose: true,
          panelClass: ['full-screen-modal']
        })
        .afterClosed()
        .subscribe((abilityFormValue) => {
          if (abilityFormValue) {
            this.abilitiesList[index].setValue(abilityFormValue);
            this.battlegroundForm.markAsTouched();
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
          }
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
      this.addAbility(ability);
    });
  }

  public importBattlegrounds(): void {
    const upload: HTMLInputElement = document.createElement('input');
    upload.type = 'file';
    upload.style.display = 'none';
    document.body.appendChild(upload);
    upload.addEventListener('change', () => {
      if ((upload as any).files.length > 0) {
        const reader: FileReader = new FileReader();
        reader.addEventListener('load', () => {
          const battlegrounds = JSON.parse(
            (reader as any).result
          ) as Battleground[];
          console.log(battlegrounds);
          battlegrounds.forEach((battleground) => {
            if (battleground.universal) {
              this.battlegroundsService.editBattleground(0, battleground);
            }
            this.addNewBattleground(battleground, false);
          });
          this.selectBattleground(0);
        });
        reader.readAsText((upload as any).files[0]);
      }
    });
    upload.click();
    document.body.removeChild(upload);
  }

  public exportBattlegrounds(): void {
    const filename = `battlegrounds.json`;
    const jsonStr = JSON.stringify(this.battlegroundsService.battlegrounds);
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
