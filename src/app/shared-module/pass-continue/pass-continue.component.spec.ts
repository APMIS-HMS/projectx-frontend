import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassContinueComponent } from './pass-continue.component';

describe('PassContinueComponent', () => {
  let component: PassContinueComponent;
  let fixture: ComponentFixture<PassContinueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassContinueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
