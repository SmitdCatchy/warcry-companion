import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { loadFull } from 'tsparticles';
import { Engine, MoveDirection, OutMode } from 'tsparticles-engine';
import { ColorCodes } from './core/enums/color.enum';
import { Theme } from './core/enums/theme.enum';
import { CoreService } from './core/services/core.service';
import { Slider } from './app-routing.animation';
@Component({
  selector: 'smitd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [Slider]
})
export class AppComponent {
  public particlesOptions: any;
  constructor(public readonly core: CoreService) {
    this.particlesOptions = {
      fpsLimit: 120,
      particles: {
        color: {
          value:
            this.core.getTheme() === Theme.Dark
              ? ColorCodes.Orange
              : ColorCodes.Blue
        },
        move: {
          direction: MoveDirection.top,
          enable: true,
          outModes: {
            default: OutMode.out
          },
          speed: 4
        },
        number: {
          density: {
            enable: true,
            area: 1200
          },
          value: 150
        },
        opacity: {
          value: 0.8,
          random: true
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0
          }
        },
        size: {
          value: 2,
          random: true,
          anim: {
            enable: true,
            speed: 5,
            size_min: 0.01,
            sync: false
          }
        }
      }
    };
  }

  public async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }

  public prepareRoute(outlet: RouterOutlet): any {
    return (
      outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']
    );
  }
}
