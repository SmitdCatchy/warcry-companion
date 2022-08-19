import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierDialogComponent } from './modifier-dialog.component';

describe('ModifierDialogComponent', () => {
  let component: ModifierDialogComponent;
  let fixture: ComponentFixture<ModifierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
