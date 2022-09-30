import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BattleState } from 'src/app/core/enums/battle-state.enum';
import { Color } from 'src/app/core/enums/color.enum';
import { Battle } from 'src/app/core/models/battle.model';
import { Battleground } from 'src/app/core/models/battleground.model';
import { Fighter } from 'src/app/core/models/fighter.model';
import { Warband } from 'src/app/core/models/warband.model';
import { BattleService } from 'src/app/core/services/battle.service';
import { BattlegroundsService } from 'src/app/core/services/battlegrounds.service';

@Component({
  selector: 'smitd-battle-dialog',
  templateUrl: './battle-dialog.component.html',
  styleUrls: ['./battle-dialog.component.scss']
})
export class BattleDialogComponent {
  public battleForm: FormGroup;
  public warbandForm: FormGroup;
  public BattleState = BattleState;
  public battlegroundList: Battleground[];
  public colorList = Object.keys(Color).map((key) => ({
    key,
    value: Color[key as keyof typeof Color]
  }));

  constructor(
    public dialogRef: MatDialogRef<BattleDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      battle: Battle;
      warband: Warband;
    },
    private battlegroundService: BattlegroundsService,
    private readonly translateService: TranslateService
  ) {
    this.warbandForm = new FormGroup({
      name: new FormControl(
        this.data.warband ? this.data.warband.name : this.translateService.instant('battle-page.quick')
      ),
      alliance: new FormControl(
        this.data.warband ? this.data.warband.alliance : ''
      ),
      icon: new FormControl(
        this.data.warband ? this.data.warband.icon : ''
      ),
      faction: new FormControl(
        this.data.warband ? this.data.warband.faction : this.translateService.instant('common.unaligned')
      ),
      fighters: new FormControl(
        this.data.warband ? this.data.warband.fighters : []
      ),
      color: new FormControl(
        this.data.warband ? this.data.warband.color : Color.grey
      ),
      abilities: new FormControl(
        this.data.warband ? this.data.warband.abilities : []
      ),
      campaign: new FormControl(
        this.data.warband
          ? this.data.warband.campaign
          : {
              name: '',
              limit: 1000,
              reputation: 2,
              glory: 0,
              notes: ''
            }
      ),
      multiplayer: new FormControl(false)
    });
    this.battleForm = new FormGroup({
      roster: new FormControl(
        this.fighters.value.map((fighter: Fighter, index: number) =>
          BattleService.createFighterReference(fighter, index)
        )
      ),
      hammer: new FormControl([]),
      shield: new FormControl([]),
      dagger: new FormControl([]),
      wild: new FormControl([]),
      battleState: new FormControl(BattleState.Roster),
      turn: new FormControl(1),
      victoryPoints: new FormControl(0),
      multiplayer: new FormControl(false),
      campaign: new FormControl(false),
      battlegrounds: new FormControl([])
    });
    this.battlegroundList = this.battlegroundService.battlegrounds.slice(1);
  }

  public get runningBattle(): boolean {
    return this.data.battle.battleState !== BattleState.Peace;
  }

  public get warband(): Warband {
    return this.data.warband;
  }

  public get selectedColor(): string {
    return this.warbandForm.get('color')!.value;
  }

  public get fighters(): AbstractControl {
    return this.warbandForm.get('fighters') as AbstractControl;
  }

  public get campaign(): AbstractControl {
    return this.battleForm.get('campaign') as AbstractControl;
  }

  public get features(): AbstractControl {
    return this.battleForm.get('campaign') as AbstractControl;
  }

  public get color(): AbstractControl {
    return this.warbandForm.get('color') as AbstractControl;
  }

  public acceptDialog(newBattle: boolean = true): void {
    this.dialogRef.close({
      newBattle,
      battle: {
        ...this.battleForm.value,
        warband: this.warbandForm.value,
        battlegrounds: [
          this.battlegroundService.universalAbilities,
          ...this.battleForm.value.battlegrounds
        ]
      }
    });
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}
