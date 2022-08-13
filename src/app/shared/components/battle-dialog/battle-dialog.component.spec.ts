import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleDialogComponent } from './battle-dialog.component';

describe('BattleDialogComponent', () => {
  let component: BattleDialogComponent;
  let fixture: ComponentFixture<BattleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
