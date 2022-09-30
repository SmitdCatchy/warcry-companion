import { ApplicationRef, Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { loadFull } from 'tsparticles';
import { Engine, MoveDirection, OutMode } from 'tsparticles-engine';
import { Theme } from './core/enums/theme.enum';
import { CoreService } from './core/services/core.service';
import { Slider } from './app-routing.animation';
import { Color } from './core/enums/color.enum';
import { TranslationService } from './core/services/translation.service';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, filter, first, from, interval, Subscription } from 'rxjs';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'smitd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [Slider]
})
export class AppComponent implements OnDestroy {
  public particlesOptions: any;
  private _subscriptions = new Subscription();
  constructor(
    public readonly core: CoreService,
    private readonly translationService: TranslationService,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,
    private readonly updates: SwUpdate,
    private appRef: ApplicationRef
  ) {
    this.particlesOptions = {
      fpsLimit: 120,
      particles: {
        color: {
          value: this.core.getTheme() === Theme.Dark ? Color.orange : Color.blue
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
    this.updateClient();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }

  public prepareRoute(outlet: RouterOutlet): any {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  private updateClient(): void {
    if (!this.updates.isEnabled) {
      console.error('Not Enabled');
      return;
    }
    this._subscriptions.add(
      this.updates.versionUpdates
        .pipe(
          filter(
            (evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'
          )
        )
        .subscribe((event) => {
          this._subscriptions.add(
            this.dialog
              .open(ConfirmDialogComponent, {
                data: {
                  question: this.translateService.instant('pwa.update')
                },
                closeOnNavigation: false
              })
              .afterClosed()
              .subscribe((decision) => {
                if (decision) {
                  this._subscriptions.add(
                    from(this.updates.activateUpdate()).subscribe((update) => {
                      document.location.reload();
                    })
                  );
                }
              })
          );
        })
    );
  }
}
