import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationPriceComponent } from './investigation-price.component';

describe('InvestigationPriceComponent', () => {
  let component: InvestigationPriceComponent;
  let fixture: ComponentFixture<InvestigationPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestigationPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
