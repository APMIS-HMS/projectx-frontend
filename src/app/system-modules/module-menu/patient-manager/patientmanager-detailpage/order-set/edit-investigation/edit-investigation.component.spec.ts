import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvestigationComponent } from './edit-investigation.component';

describe('EditInvestigationComponent', () => {
  let component: EditInvestigationComponent;
  let fixture: ComponentFixture<EditInvestigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInvestigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
