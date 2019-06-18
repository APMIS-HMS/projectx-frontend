import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FcBeneficiaryListComponent } from './fc-beneficiary-list.component';

describe('FcBeneficiaryListComponent', () => {
  let component: FcBeneficiaryListComponent;
  let fixture: ComponentFixture<FcBeneficiaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FcBeneficiaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FcBeneficiaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
