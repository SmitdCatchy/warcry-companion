import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, from, switchMap } from 'rxjs';
import { LocalStorageKey, StoreKey } from '../enums/local-keys.enum';
import { Theme } from '../enums/theme.enum';
import { Color } from '../enums/color.enum';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Warband } from '../models/warband.model';
import { Runemark } from '../models/runemark.model';

export const databaseVersion = 2;
@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private _themeSubject: BehaviorSubject<Theme>;
  private _colorSubject: BehaviorSubject<Color>;
  private _previousTheme: Theme;
  effectsEnabled: boolean;
  _loader: boolean;
  private _database?: IDBDatabase;
  private _databaseOldVersion?: number;

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

  get theme(): Observable<Theme> {
    return this._themeSubject.asObservable();
  }

  getTheme(): Theme {
    return this._themeSubject.value;
  }

  get color(): Observable<Color> {
    return this._colorSubject.asObservable();
  }

  getColor(): Color {
    return this._colorSubject.value;
  }

  setTheme(theme: Theme) {
    this._previousTheme = this._themeSubject.value;
    CoreService.setLocalStorage(LocalStorageKey.Theme, theme);
    this._themeSubject.next(theme);
    location.reload();
  }

  setColor(color: Color) {
    CoreService.setLocalStorage(LocalStorageKey.Color, color || Color.grey);
    this.meta.updateTag(
      { name: 'theme-color', content: color || Color.grey },
      'name=theme-color'
    );
    this._colorSubject.next(color || Color.grey);
  }

  static getLocalStorage(key: string, missing: string = ''): string {
    return localStorage.getItem(key) || missing;
  }

  static setLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  static removeLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  static checkLocalStorageSpace(): Observable<StorageEstimate> {
    const storageManagerOb = navigator.storage;
    return from(navigator.storage.estimate());
  }

  switchEffects(): void {
    this.effectsEnabled = !this.effectsEnabled;
    CoreService.setLocalStorage(
      LocalStorageKey.Effects,
      `${this.effectsEnabled}`
    );
    location.reload();
  }

  startLoader(): void {
    this._loader = true;
  }

  stopLoader(): void {
    this._loader = false;
  }

  get loading(): boolean {
    return this._loader;
  }

  handleFileUpload(
    loaded: (result: any) => any = () => {},
    type: 'json' | 'image' | 'other' = 'json',
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
        default:
          reader.onload = () => {
            loaded((reader as any).result as string);
          };
          reader.readAsText((upload as any).files[0]);
          break;
      }
    };
    document.body.appendChild(upload);

    upload.click();
  }

  back(): void {
    if (history.state.navigationId < 2) {
      this.router.navigateByUrl('/');
    } else {
      this.location.back();
    }
  }

  initStore(): Observable<any> {
    return from(
      new Promise((resolve, reject) => {
        if (this._database) {
          resolve(this._database);
          return;
        }
        const openRequest = indexedDB.open(StoreKey.Database, databaseVersion);
        openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          this._databaseOldVersion = event.oldVersion;
          const db = openRequest.result;
          // switch(event.oldVersion) { // existing db version
          // case 0:
          // version 0 means that the client had no database
          // perform initialization
          db.createObjectStore(StoreKey.Store, { keyPath: 'name' });
          // case 1:
          // client had version 1
          // update
          // }
        };
        openRequest.onerror = () => {
          reject(openRequest.error);
        };
        openRequest.onsuccess = () => {
          this._database = openRequest.result;
          if (this._databaseOldVersion !== undefined) {
            const transaction = this._database.transaction(
              StoreKey.Store,
              'readwrite'
            );
            const mainStore = transaction.objectStore(StoreKey.Store);
            switch (this._databaseOldVersion) {
              // @ts-ignore
              case 0:
                const requestWarbansStore = mainStore.put({
                  name: StoreKey.WarbandsStore,
                  data: JSON.parse(
                    CoreService.getLocalStorage(LocalStorageKey.Warbands, '[]')
                  ) as Warband[]
                });

                requestWarbansStore.onsuccess = () => {
                  resolve(requestWarbansStore.result);
                };

                requestWarbansStore.onerror = () => {
                  reject(requestWarbansStore.error);
                };
                const requestBattlegroundsStore = mainStore.put({
                  name: StoreKey.BattlegroundsStore,
                  data: JSON.parse(
                    CoreService.getLocalStorage(
                      LocalStorageKey.Battlegrounds,
                      '[]'
                    )
                  ) as Warband[]
                });

                requestBattlegroundsStore.onsuccess = () => {
                  resolve(requestBattlegroundsStore.result);
                };

                requestBattlegroundsStore.onerror = () => {
                  reject(requestBattlegroundsStore.error);
                };
                const requestFighterStore = mainStore.put({
                  name: StoreKey.FighterStore,
                  data: JSON.parse(
                    CoreService.getLocalStorage(
                      LocalStorageKey.FighterStore,
                      '[]'
                    )
                  ) as Warband[]
                });

                requestFighterStore.onsuccess = () => {
                  resolve(requestFighterStore.result);
                };

                requestFighterStore.onerror = () => {
                  reject(requestFighterStore.error);
                };
              case 1:
                const requestRunemarkStore = mainStore.put({
                  name: StoreKey.RunemarkStore,
                  data: [] as Runemark[]
                });

                requestRunemarkStore.onsuccess = () => {
                  resolve(requestRunemarkStore.result);
                };

                requestRunemarkStore.onerror = () => {
                  reject(requestRunemarkStore.error);
                };
            }
          } else {
            resolve(this._database);
            this._database.onversionchange = () => {
              this._database!.close();
              delete this._database;
              alert('Database is outdated, please reload the page.');
            };
          }
        };
      })
    );
  }

  getStore(storekey: StoreKey): Observable<any> {
    return this.initStore().pipe(
      switchMap((result) => {
        return from(
          new Promise((resolve, reject) => {
            if (!this._database) {
              reject('IDBDatabase is not initialized!');
              return;
            }
            const transaction = this._database.transaction(
              StoreKey.Store,
              'readonly'
            );
            const mainStore = transaction.objectStore(StoreKey.Store);
            const request = mainStore.get(storekey);

            request.onsuccess = () => {
              resolve(request.result ? request.result.data : []);
            };

            request.onerror = () => {
              reject(request.error);
            };
          })
        );
      })
    );
  }

  setStore(value: any): Observable<any> {
    return from(
      new Promise((resolve, reject) => {
        if (!this._database) {
          reject('IDBDatabase is not initialized!');
          return;
        }
        const transaction = this._database.transaction(
          StoreKey.Store,
          'readwrite'
        );
        const mainStore = transaction.objectStore(StoreKey.Store);
        const request = mainStore.put(value);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      })
    );
  }
}
