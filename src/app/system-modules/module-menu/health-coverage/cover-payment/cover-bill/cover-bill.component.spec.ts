import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverBillComponent } from './cover-bill.component';

describe('CoverBillComponent', () => {
  let component: CoverBillComponent;
  let fixture: ComponentFixture<CoverBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
