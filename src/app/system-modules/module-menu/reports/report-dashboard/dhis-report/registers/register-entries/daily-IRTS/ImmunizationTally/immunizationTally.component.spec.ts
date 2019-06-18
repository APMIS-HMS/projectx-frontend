import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { immunizationTallyComponent } from './immunizationTally.component';

describe('immunizationTallyComponent', () => {
  let component: immunizationTallyComponent;
  let fixture: ComponentFixture<immunizationTallyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ immunizationTallyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(immunizationTallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
