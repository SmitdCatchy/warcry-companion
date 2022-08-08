import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityFormComponent } from './ability-form.component';

describe('AbilityFormComponent', () => {
  let component: AbilityFormComponent;
  let fixture: ComponentFixture<AbilityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbilityFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
