import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'smitd-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  public version = '1.2.2 - Auric';
  public year = new Date().getFullYear();
  constructor(public core: CoreService) {}
}
