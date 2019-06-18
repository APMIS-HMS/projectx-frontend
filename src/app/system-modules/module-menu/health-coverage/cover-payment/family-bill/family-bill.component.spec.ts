import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyBillComponent } from './family-bill.component';

describe('FamilyBillComponent', () => {
  let component: FamilyBillComponent;
  let fixture: ComponentFixture<FamilyBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
