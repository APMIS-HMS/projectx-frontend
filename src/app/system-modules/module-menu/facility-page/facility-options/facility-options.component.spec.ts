import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityOptionsComponent } from './facility-options.component';

describe('FacilityOptionsComponent', () => {
  let component: FacilityOptionsComponent;
  let fixture: ComponentFixture<FacilityOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
