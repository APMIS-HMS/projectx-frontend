import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmAppntHistoryComponent } from './rm-appnt-history.component';

describe('RmAppntHistoryComponent', () => {
  let component: RmAppntHistoryComponent;
  let fixture: ComponentFixture<RmAppntHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmAppntHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmAppntHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
