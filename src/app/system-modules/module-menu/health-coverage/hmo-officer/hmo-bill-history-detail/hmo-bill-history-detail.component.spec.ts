import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoBillHistoryDetailComponent } from './hmo-bill-history-detail.component';

describe('HmoBillHistoryDetailComponent', () => {
  let component: HmoBillHistoryDetailComponent;
  let fixture: ComponentFixture<HmoBillHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmoBillHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmoBillHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
