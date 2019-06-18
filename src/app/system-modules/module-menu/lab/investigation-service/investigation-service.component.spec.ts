import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationServiceComponent } from './investigation-service.component';

describe('InvestigationServiceComponent', () => {
  let component: InvestigationServiceComponent;
  let fixture: ComponentFixture<InvestigationServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestigationServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
