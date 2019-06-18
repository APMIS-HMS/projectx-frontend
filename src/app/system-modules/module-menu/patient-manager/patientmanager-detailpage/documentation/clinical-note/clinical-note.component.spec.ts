import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalNoteComponent } from './clinical-note.component';

describe('ClinicalNoteComponent', () => {
  let component: ClinicalNoteComponent;
  let fixture: ComponentFixture<ClinicalNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
