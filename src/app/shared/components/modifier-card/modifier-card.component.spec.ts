import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierCardComponent } from './modifier-card.component';

describe('ModifierCardComponent', () => {
  let component: ModifierCardComponent;
  let fixture: ComponentFixture<ModifierCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
