import { ApplicationRef, Component, Inject, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
  RouterState
} from '@angular/router';
import { loadFull } from 'tsparticles';
import { Engine, MoveDirection, OutMode } from 'tsparticles-engine';
import { Theme } from './core/enums/theme.enum';
import { CoreService } from './core/services/core.service';
import { Slider } from './app-routing.animation';
import { Color } from './core/enums/color.enum';
import { TranslationService } from './core/services/translation.service';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, from, Subscription } from 'rxjs';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './core/services/data.service';
import { DOCUMENT } from '@angular/common';
import { LocalStorageKey } from './core/enums/local-keys.enum';

@Component({
  selector: 'smitd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [Slider]
})
export class AppComponent implements OnDestroy {
  particlesOptions: any;
  private _subscriptions = new Subscription();
  constructor(
    readonly core: CoreService,
    private readonly translationService: TranslationService,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,
    private readonly updates: SwUpdate,
    private appRef: ApplicationRef,
    private readonly dataService: DataService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.particlesOptions = {
      fpsLimit: 60,
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
    this.handleRouteEvents();
    this.cookieConsent();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }

  prepareRoute(outlet: RouterOutlet): any {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  private updateClient(): void {
    if (!this.updates.isEnabled) {
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

  private handleRouteEvents() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(
          this.router.routerState,
          this.router.routerState.root
        ).join('-');
        (window as any).gtag('event', 'page_view', {
          page_title: title,
          page_path: event.urlAfterRedirects,
          page_location: this.document.location.href,
          selected_language: this.translationService.language
        });
      }
    });
  }

  private getTitle(state: RouterState, parent: ActivatedRoute): string[] {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data['title']) {
      data.push(parent.snapshot.data['title']);
    }
    if (state && parent && parent.firstChild) {
      data.push(...this.getTitle(state, parent.firstChild));
    }
    return data;
  }

  private cookieConsent(): void {
    if (!CoreService.getLocalStorage(LocalStorageKey.CookieConsent)) {
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            confirmation: true,
            noLabel: this.translateService.instant('common.ok'),
            title: this.translateService.instant('cookie-consent.title'),
            question: this.translateService.instant(
              'cookie-consent.description'
            )
          },
          closeOnNavigation: false
        })
        .afterClosed()
        .subscribe(() => {
          CoreService.setLocalStorage(LocalStorageKey.CookieConsent, 'true');
        });
    }
  }
}
