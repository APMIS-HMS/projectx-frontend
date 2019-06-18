import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhmisSummaryComponent } from './nhmis-summary.component';

describe('NhmisSummaryComponent', () => {
  let component: NhmisSummaryComponent;
  let fixture: ComponentFixture<NhmisSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhmisSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhmisSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
