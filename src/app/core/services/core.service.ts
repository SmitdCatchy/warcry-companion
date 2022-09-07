import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, from } from 'rxjs';
import { LocalStorageKey } from '../enums/local-keys.enum';
import { Theme } from '../enums/theme.enum';
import { Color } from '../enums/color.enum';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private _themeSubject: BehaviorSubject<Theme>;
  private _colorSubject: BehaviorSubject<Color>;
  private _previousTheme: Theme;
  public effectsEnabled: boolean;
  public _loader: boolean;

  constructor(
    private readonly meta: Meta,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
    private readonly location: Location,
    private readonly router: Router
  ) {
    this._themeSubject = new BehaviorSubject<Theme>(
      CoreService.getLocalStorage(LocalStorageKey.Theme, Theme.Dark) as Theme
    );
    this._colorSubject = new BehaviorSubject<Color>(
      CoreService.getLocalStorage(LocalStorageKey.Color, Color.orange) as Color
    );
    this.meta.updateTag(
      { name: 'theme-color', content: this.getColor() },
      'name=theme-color'
    );
    this.effectsEnabled =
      CoreService.getLocalStorage(LocalStorageKey.Effects, 'true') === 'true';
    this._previousTheme = this._themeSubject.value;
    document.body.classList.toggle(this._themeSubject.value);
    this._themeSubject
      .pipe(filter((theme) => theme !== this._previousTheme))
      .subscribe((theme) => {
        document.body.classList.toggle(this._previousTheme);
        document.body.classList.toggle(theme);
      });
    this.matIconRegistry.addSvgIcon(
      'swords',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/warcry-companion/assets/mat-icons/swords.svg'
      )
    );
    this._loader = false;
  }

  public get theme(): Observable<Theme> {
    return this._themeSubject.asObservable();
  }

  public getTheme(): Theme {
    return this._themeSubject.value;
  }

  public get color(): Observable<Color> {
    return this._colorSubject.asObservable();
  }

  public getColor(): Color {
    return this._colorSubject.value;
  }

  public setTheme(theme: Theme) {
    this._previousTheme = this._themeSubject.value;
    CoreService.setLocalStorage(LocalStorageKey.Theme, theme);
    this._themeSubject.next(theme);
    location.reload();
  }

  public setColor(color: Color) {
    CoreService.setLocalStorage(LocalStorageKey.Color, color || Color.grey);
    this.meta.updateTag(
      { name: 'theme-color', content: color || Color.grey },
      'name=theme-color'
    );
    this._colorSubject.next(color || Color.grey);
  }

  public static getLocalStorage(key: string, missing: string = ''): string {
    return localStorage.getItem(key) || missing;
  }

  public static setLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public static removeLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  public static checkLocalStorageSpace(): Observable<StorageEstimate> {
    const storageManagerOb = navigator.storage;
    return from(navigator.storage.estimate());
  }

  public switchEffects(): void {
    this.effectsEnabled = !this.effectsEnabled;
    CoreService.setLocalStorage(
      LocalStorageKey.Effects,
      `${this.effectsEnabled}`
    );
    location.reload();
  }

  public startLoader(): void {
    this._loader = true;
  }

  public stopLoader(): void {
    this._loader = false;
  }

  public get loading(): boolean {
    return this._loader;
  }

  public handleFileUpload(
    loaded: (result: any) => any = () => {},
    type: 'json' | 'image' = 'json',
    jsonTypeCheck?: string
  ): void {
    const upload: HTMLInputElement = document.createElement('input');
    upload.type = 'file';
    upload.style.display = 'none';
    switch (type) {
      case 'json':
        upload.accept = 'application/json';
        break;
      case 'image':
        upload.accept = 'image/*';
        break;
      default:
        console.error('Incorrect upload type!');
        break;
    }

    upload.onchange = () => {
      const reader: FileReader = new FileReader();
      switch (type) {
        case 'json':
          reader.onload = () => {
            const result = JSON.parse((reader as any).result);
            if (jsonTypeCheck && result.type !== jsonTypeCheck) {
              this.dialog.open(ConfirmDialogComponent, {
                data: {
                  confirmation: true,
                  noLabel: this.translateService.instant('common.ok'),
                  question: this.translateService.instant('import.failed.type')
                },
                closeOnNavigation: false
              });
              return;
            }
            loaded(result);
          };
          reader.readAsText((upload as any).files[0]);
          break;
        case 'image':
          reader.onload = () => {
            loaded((reader as any).result as string);
          };
          reader.readAsDataURL((upload as any).files[0]);
          break;
      }
    };
    document.body.appendChild(upload);

    upload.click();
  }

  public back(): void {
    if (history.state.navigationId < 2) {
      this.router.navigateByUrl('/');
    } else {
      this.location.back();
    }
  }
}
