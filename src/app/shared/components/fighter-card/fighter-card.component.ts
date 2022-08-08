import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Color } from 'src/app/core/enums/color.enum';
import { FighterCardMode } from 'src/app/core/enums/fighter-card-mode.enum';
import { FighterRole } from 'src/app/core/enums/fighter-role.enum';
import { Fighter } from 'src/app/core/models/fighter.model';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'smitd-fighter-card',
  templateUrl: './fighter-card.component.html',
  styleUrls: ['./fighter-card.component.scss']
})
export class FighterCardComponent {
  @Input('fighter') fighter: Fighter;
  @Input('mode') mode: string;
  public FighterRole = FighterRole;
  public FighterCardMode = FighterCardMode;
  @Output() callAbilities: EventEmitter<null>;

  constructor(public readonly core: CoreService) {
    this.fighter = {
      role: FighterRole.Thrall,
      type: 'Error Thrall',
      movement: 1,
      toughness: 1,
      wounds: 2,
      runemarks: ['Minion'],
      weapons: [
        {
          range: 1,
          attacks: 1,
          strength: 2,
          damage: 1,
          crit: 2,
          type: 'Claws'
        }
      ],
      points: 100,
      name: '',
      modifiers: [],
      note: ''
    };
    this.mode = 'roster';
    this.callAbilities = new EventEmitter();
  }
}
