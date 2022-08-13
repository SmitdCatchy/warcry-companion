import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Battleground } from 'src/app/core/enums/battle-ground.enum';
import { BattleState } from 'src/app/core/enums/battle-state.enum';
import { Color } from 'src/app/core/enums/color.enum';
import { Battle } from 'src/app/core/models/battle.model';
import { Fighter } from 'src/app/core/models/fighter.model';
import { Warband } from 'src/app/core/models/warband.model';
import { BattleService } from 'src/app/core/services/battle.service';

@Component({
  selector: 'smitd-battle-dialog',
  templateUrl: './battle-dialog.component.html',
  styleUrls: ['./battle-dialog.component.scss']
})
export class BattleDialogComponent {
  public battleForm: FormGroup;
  public warbandForm: FormGroup;
  public BattleState = BattleState;
  public Battleground = Battleground;
  public battlegroundList = Object.values(Battleground);
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
    }
  ) {
    this.warbandForm = new FormGroup({
      name: new FormControl(
        this.data.warband ? this.data.warband.name : 'battle-page.quick'
      ),
      alliance: new FormControl(
        this.data.warband ? this.data.warband.alliance : ''
      ),
      faction: new FormControl(
        this.data.warband ? this.data.warband.faction : 'common.unaligned'
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
      )
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
      groupless: new FormControl(false),
      campaign: new FormControl(false),
      features: new FormControl([])
    });
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
        warband: this.warbandForm.value
      }
    });
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}
