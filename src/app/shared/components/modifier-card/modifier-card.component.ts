import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ModifierType } from 'src/app/core/enums/modifier-type.enum';
import { Modifier } from 'src/app/core/models/modifier.model';

@Component({
  selector: 'smitd-modifier-card',
  templateUrl: './modifier-card.component.html',
  styleUrls: ['./modifier-card.component.scss']
})
export class ModifierCardComponent {
  @Input() modifier: Modifier;
  @Input() showUsage: boolean;
  @Input() showUsed: boolean;
  @Input() disabled: boolean;
  @Input() edit: boolean;
  @Output() used: EventEmitter<null>;

  constructor() {
    this.modifier = {
      name: 'ERROR MODIFIER',
      type: ModifierType.Injury,
      description: '',
      modify: {
        movement: 0,
        toughness: 0,
        wounds: 0,
        weapon: {
          ranged: false,
          attacks: 0,
          strength: 0,
          damage: 0,
          crit: 0
        }
      }
    };
    this.showUsage = false;
    this.showUsed = false;
    this.disabled = false;
    this.edit = false;
    this.used = new EventEmitter();
  }

  useModifier(): void {
    if (!this.disabled) {
      this.modifier.used = !this.modifier.used;
      this.used.emit();
    }
  }
}
