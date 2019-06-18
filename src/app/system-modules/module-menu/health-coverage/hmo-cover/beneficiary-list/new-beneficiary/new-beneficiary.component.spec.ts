import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBeneficiaryComponent } from './new-beneficiary.component';

describe('NewBeneficiaryComponent', () => {
  let component: NewBeneficiaryComponent;
  let fixture: ComponentFixture<NewBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
