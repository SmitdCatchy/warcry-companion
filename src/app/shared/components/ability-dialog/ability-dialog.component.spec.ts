import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityDialogComponent } from './ability-dialog.component';

describe('AbilityDialogComponent', () => {
  let component: AbilityDialogComponent;
  let fixture: ComponentFixture<AbilityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbilityDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbilityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
