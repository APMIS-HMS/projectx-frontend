import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenBillSearchComponent } from './gen-bill-search.component';

describe('GenBillSearchComponent', () => {
  let component: GenBillSearchComponent;
  let fixture: ComponentFixture<GenBillSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenBillSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenBillSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
