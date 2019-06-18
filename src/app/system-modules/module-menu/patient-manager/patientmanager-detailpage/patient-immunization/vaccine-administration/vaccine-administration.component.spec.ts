import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccineAdministrationComponent } from './vaccine-administration.component';

describe('VaccineAdministrationComponent', () => {
  let component: VaccineAdministrationComponent;
  let fixture: ComponentFixture<VaccineAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaccineAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccineAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
