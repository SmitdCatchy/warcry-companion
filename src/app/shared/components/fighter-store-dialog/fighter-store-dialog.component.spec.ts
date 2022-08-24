import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FighterStoreDialogComponent } from './fighter-store-dialog.component';

describe('FighterStoreDialogComponent', () => {
  let component: FighterStoreDialogComponent;
  let fixture: ComponentFixture<FighterStoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FighterStoreDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FighterStoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
