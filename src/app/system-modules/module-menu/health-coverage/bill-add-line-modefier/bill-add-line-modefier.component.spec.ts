import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAddLineModefierComponent } from './bill-add-line-modefier.component';

describe('BillAddLineModefierComponent', () => {
  let component: BillAddLineModefierComponent;
  let fixture: ComponentFixture<BillAddLineModefierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillAddLineModefierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillAddLineModefierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
