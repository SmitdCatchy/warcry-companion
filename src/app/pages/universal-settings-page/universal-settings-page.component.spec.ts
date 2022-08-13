import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalSettingsPageComponent } from './universal-settings-page.component';

describe('UniversalSettingsPageComponent', () => {
  let component: UniversalSettingsPageComponent;
  let fixture: ComponentFixture<UniversalSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversalSettingsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
