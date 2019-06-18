import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyBillHistoryDetailComponent } from './family-bill-history-detail.component';

describe('FamilyBillHistoryDetailComponent', () => {
  let component: FamilyBillHistoryDetailComponent;
  let fixture: ComponentFixture<FamilyBillHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyBillHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyBillHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
