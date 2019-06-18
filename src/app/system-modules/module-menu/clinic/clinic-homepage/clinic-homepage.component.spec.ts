import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHomepageComponent } from './clinic-homepage.component';

describe('ClinicHomepageComponent', () => {
  let component: ClinicHomepageComponent;
  let fixture: ComponentFixture<ClinicHomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
