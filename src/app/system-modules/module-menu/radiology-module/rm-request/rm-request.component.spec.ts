import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmRequestComponent } from './rm-request.component';

describe('RmRequestComponent', () => {
  let component: RmRequestComponent;
  let fixture: ComponentFixture<RmRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
