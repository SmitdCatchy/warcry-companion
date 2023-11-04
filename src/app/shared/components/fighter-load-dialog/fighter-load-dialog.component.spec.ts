import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FighterLoadDialogComponent } from './fighter-load-dialog.component';

describe('FighterLoadDialogComponent', () => {
  let component: FighterLoadDialogComponent;
  let fixture: ComponentFixture<FighterLoadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FighterLoadDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FighterLoadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
