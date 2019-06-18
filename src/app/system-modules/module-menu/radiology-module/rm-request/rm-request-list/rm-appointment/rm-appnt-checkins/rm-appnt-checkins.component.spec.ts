import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmAppntCheckinsComponent } from './rm-appnt-checkins.component';

describe('RmAppntCheckinsComponent', () => {
  let component: RmAppntCheckinsComponent;
  let fixture: ComponentFixture<RmAppntCheckinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmAppntCheckinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmAppntCheckinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
