import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarbandPageComponent } from './warband-page.component';

describe('WarbandPageComponent', () => {
  let component: WarbandPageComponent;
  let fixture: ComponentFixture<WarbandPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarbandPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarbandPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
