import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleEndDialogComponent } from './battle-end-dialog.component';

describe('BattleEndDialogComponent', () => {
  let component: BattleEndDialogComponent;
  let fixture: ComponentFixture<BattleEndDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattleEndDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattleEndDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
