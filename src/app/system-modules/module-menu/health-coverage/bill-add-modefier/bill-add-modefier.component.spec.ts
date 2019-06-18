import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAddModefierComponent } from './bill-add-modefier.component';

describe('BillAddModefierComponent', () => {
  let component: BillAddModefierComponent;
  let fixture: ComponentFixture<BillAddModefierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillAddModefierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillAddModefierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
