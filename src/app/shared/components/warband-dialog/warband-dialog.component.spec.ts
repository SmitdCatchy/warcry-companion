import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarbandDialogComponent } from './warband-dialog.component';

describe('WarbandDialogComponent', () => {
  let component: WarbandDialogComponent;
  let fixture: ComponentFixture<WarbandDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarbandDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarbandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
