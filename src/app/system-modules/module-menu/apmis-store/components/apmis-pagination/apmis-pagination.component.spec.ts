import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApmisPaginationComponent } from './apmis-pagination.component';

describe('ApmisPaginationComponent', () => {
  let component: ApmisPaginationComponent;
  let fixture: ComponentFixture<ApmisPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApmisPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApmisPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
