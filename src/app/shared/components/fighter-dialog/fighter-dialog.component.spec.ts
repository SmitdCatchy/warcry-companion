import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FighterDialogComponent } from './fighter-dialog.component';

describe('FighterDialogComponent', () => {
  let component: FighterDialogComponent;
  let fixture: ComponentFixture<FighterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FighterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FighterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
