import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalInvestigationsComponent } from './external-investigations.component';

describe('ExternalInvestigationsComponent', () => {
  let component: ExternalInvestigationsComponent;
  let fixture: ComponentFixture<ExternalInvestigationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalInvestigationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalInvestigationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
