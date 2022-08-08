import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'smitd-icon-uploader',
  templateUrl: './icon-uploader.component.html',
  styleUrls: ['./icon-uploader.component.scss']
})
export class IconUploaderComponent implements OnInit {
  @Output() iconValueChange: EventEmitter<string>;
  @Input() iconValue: string | undefined;

  constructor(public readonly core: CoreService) {
    this.iconValueChange = new EventEmitter();
  }

  ngOnInit(): void {}

  public iconUpload(event: any): void {
    const file = event.target.files[0] as File;
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const icon = new Image();
        icon.onload = () => {
          this.iconValueChange.emit(icon.src);
        };
        icon.src = fileReader.result as string;
      };
      fileReader.readAsDataURL(file);
    }
  }

  public removeIcon(): void {
    this.iconValueChange.emit(undefined);
  }
}
