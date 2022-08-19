import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerExpansionComponent } from './divider-expansion.component';

describe('DividerExpansionComponent', () => {
  let component: DividerExpansionComponent;
  let fixture: ComponentFixture<DividerExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DividerExpansionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DividerExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
