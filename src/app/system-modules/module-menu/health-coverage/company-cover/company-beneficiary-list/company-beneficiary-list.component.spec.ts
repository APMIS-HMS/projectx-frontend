import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBeneficiaryListComponent } from './company-beneficiary-list.component';

describe('CompanyBeneficiaryListComponent', () => {
  let component: CompanyBeneficiaryListComponent;
  let fixture: ComponentFixture<CompanyBeneficiaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBeneficiaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBeneficiaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
