import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyBillDetailComponent } from './family-bill-detail.component';

describe('FamilyBillDetailComponent', () => {
  let component: FamilyBillDetailComponent;
  let fixture: ComponentFixture<FamilyBillDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyBillDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyBillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
