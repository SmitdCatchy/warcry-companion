import { Component, Input } from '@angular/core';

@Component({
  selector: 'smitd-divider-expansion',
  templateUrl: './divider-expansion.component.html',
  styleUrls: ['./divider-expansion.component.scss']
})
export class DividerExpansionComponent {
  @Input() expanded: boolean;
  @Input() darkBorders: boolean;

  constructor() {
    this.expanded = false;
    this.darkBorders = true;
  }
}
