import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmModalityComponent } from './rm-modality.component';

describe('RmModalityComponent', () => {
  let component: RmModalityComponent;
  let fixture: ComponentFixture<RmModalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmModalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmModalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
