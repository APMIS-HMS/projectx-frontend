import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmRequestListComponent } from './rm-request-list.component';

describe('RmRequestListComponent', () => {
  let component: RmRequestListComponent;
  let fixture: ComponentFixture<RmRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
