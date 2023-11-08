import { Injectable } from '@angular/core';
import { StoreKey } from '../enums/local-keys.enum';
import { Runemark } from '../models/runemark.model';
import { CoreService } from './core.service';

@Injectable({
  providedIn: 'root'
})
export class RunemarksService {
  private _runemarkList: Runemark[];

  constructor(private readonly core: CoreService) {
    this._runemarkList = [];
    this.core
      .getStore(StoreKey.RunemarkStore)
      .subscribe((runemarkList: Runemark[]) => {
        this._runemarkList = runemarkList;
      });
  }

  get runemarks(): Runemark[] {
    return this._runemarkList;
  }

  getRunemark(key: string): Runemark | undefined {
    return this._runemarkList.find(rm => rm.key == key);
  }

  addRunemarks(runemarks: string[] | Runemark[]): void {
    runemarks.forEach((runemark) => this.addRunemark(runemark));
  }

  addRunemark(runemark: string | Runemark): void {
    let newRunemark: Runemark = runemark as Runemark;
    if (!newRunemark.key) {
      newRunemark = {
        key: runemark as string
      };
    }
    if (
      this._runemarkList.findIndex(
        (runemark) => runemark.key === newRunemark.key
      ) < 0
    ) {
      this._runemarkList.push(newRunemark);
      this._runemarkList.sort((a,b) => a.key < b.key ? -1 : 1)
      this._saveRunemarks();
    }
  }

  removeRunemark(index: number): void {
    this._runemarkList.splice(index, 1);
    this._saveRunemarks();
  }

  updateRunemark(runemark: Runemark, index: number): void {
    this._runemarkList[index] = runemark;
    this._saveRunemarks();
  }

  private _saveRunemarks(): void {
    this.core.setStore({
      name: StoreKey.RunemarkStore,
      data: this._runemarkList
    });
  }
}
