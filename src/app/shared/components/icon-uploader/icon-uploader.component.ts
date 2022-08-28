import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
  selector: 'smitd-icon-uploader',
  templateUrl: './icon-uploader.component.html',
  styleUrls: ['./icon-uploader.component.scss']
})
export class IconUploaderComponent {
  @Output() iconValueChange: EventEmitter<string>;
  @Input() iconValue: string | undefined;

  @ViewChild('canvas') canvasRef!: ElementRef;

  constructor(public readonly core: CoreService) {
    this.iconValueChange = new EventEmitter();
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private get context(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!;
  }

  public iconUpload(event: any): void {
    const file = event.target.files[0] as File;
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const icon = new Image();
        icon.onload = () => {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          const iconSize = 84;
          const wider = icon.width > icon.height;
          const newWidth = wider ? icon.width / (icon.height / iconSize) : iconSize;
          const newHeigth = wider ? iconSize : icon.height / (icon.width / iconSize);
          this.canvas.width = newWidth;
          this.canvas.height = newHeigth;
          this.context.drawImage(
            icon,
            0,
            0,
            icon.width,
            icon.height,
            0,
            0,
            this.canvas.width,
            this.canvas.height
          );
          const image = this.canvas.toDataURL('image/png');
          this.iconValueChange.emit(image);
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
