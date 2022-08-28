import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogGuard implements CanDeactivate<any> {
  constructor(
    private readonly dialog: MatDialog,
    private readonly bottomSheet: MatBottomSheet
  ) {}
  canDeactivate(
    component: any,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.dialog.openDialogs.length > 0) {
      this.dialog.closeAll();
      history.pushState({}, "", state.url);
      return false;
    } else if (this.bottomSheet._openedBottomSheetRef) {
      this.bottomSheet.dismiss();
      history.pushState({}, "", state.url);
      return false;
    } else {
      return true;
    }
  }
}
