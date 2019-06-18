import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisPaginatedLookupComponent } from './apmis-paginated-lookup.component';

describe('ApmisPaginatedLookupComponent', () => {
  let component: ApmisPaginatedLookupComponent;
  let fixture: ComponentFixture<ApmisPaginatedLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisPaginatedLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisPaginatedLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
