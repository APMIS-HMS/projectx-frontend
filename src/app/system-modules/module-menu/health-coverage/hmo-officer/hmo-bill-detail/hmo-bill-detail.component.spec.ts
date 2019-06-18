import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoBillDetailComponent } from './hmo-bill-detail.component';

describe('HmoBillDetailComponent', () => {
  let component: HmoBillDetailComponent;
  let fixture: ComponentFixture<HmoBillDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmoBillDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmoBillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
