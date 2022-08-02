import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { LocalStorageKey } from '../enums/local-keys.enum';
import { Theme } from '../enums/theme.enum';
import { Color } from '../enums/color.enum';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private _themeSubject: BehaviorSubject<Theme>;
  private _colorSubject: BehaviorSubject<Color>;
  private _previousTheme: Theme;
  public effectsEnabled: boolean;

  constructor() {
    this._themeSubject = new BehaviorSubject<Theme>(
      CoreService.getLocalStorage(LocalStorageKey.Theme, Theme.Dark) as Theme
    );
    this._colorSubject = new BehaviorSubject<Color>(
      CoreService.getLocalStorage(LocalStorageKey.Color, Color.orange) as Color
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
    CoreService.setLocalStorage(LocalStorageKey.Color, color);
    this._colorSubject.next(color);
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

  public switchEffects(): void {
    this.effectsEnabled = !this.effectsEnabled;
    CoreService.setLocalStorage(
      LocalStorageKey.Effects,
      `${this.effectsEnabled}`
    );
    location.reload();
  }
}
