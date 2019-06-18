import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyManagerComponent } from './pharmacy-manager.component';

describe('PharmacyManagerComponent', () => {
  let component: PharmacyManagerComponent;
  let fixture: ComponentFixture<PharmacyManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
