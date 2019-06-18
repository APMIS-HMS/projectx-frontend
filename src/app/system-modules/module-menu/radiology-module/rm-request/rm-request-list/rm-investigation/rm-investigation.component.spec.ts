import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmInvestigationComponent } from './rm-investigation.component';

describe('RmInvestigationComponent', () => {
  let component: RmInvestigationComponent;
  let fixture: ComponentFixture<RmInvestigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmInvestigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
