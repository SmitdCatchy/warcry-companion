import { Component } from '@angular/core';
import { loadFull } from 'tsparticles';
import { Container, Engine, MoveDirection, OutMode } from 'tsparticles-engine';
import { CoreService } from './core/services/core.service';

@Component({
  selector: 'smitd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public particlesOptionsOld = {
    particles: {
      number: {
        value: 150,
        density: {
          enable: true,
          value_area: 2000
        }
      },
      color: {
        value: '#fd7907'
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        }
      },
      opacity: {
        value: 0.8,
        random: true,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
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
      },
      move: {
        enable: true,
        speed: 4,
        direction: 'top',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    }
  };
  constructor(public core: CoreService) {}
  particlesOptions = {
    fpsLimit: 120,
    particles: {
      color: {
        value: '#fd7907'
      },
      collisions: {
        enable: true
      },
      move: {
        direction: MoveDirection.top,
        enable: true,
        outModes: {
          default: OutMode.out
        },
        speed: 4,
        straight: false,
        bounce: false,
        attract: {
          enable: false,
          rotateX: 1200,
          rotateY: 1200
        }
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
        random: true,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: '#000000'
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
      },
    },
  };

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }
}
