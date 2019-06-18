import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosRecieptComponent } from './pos-reciept.component';

describe('PosRecieptComponent', () => {
  let component: PosRecieptComponent;
  let fixture: ComponentFixture<PosRecieptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosRecieptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosRecieptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
