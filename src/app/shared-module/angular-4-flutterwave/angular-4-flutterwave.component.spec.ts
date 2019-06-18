import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Angular4FlutterwaveComponent } from './angular-4-flutterwave.component';

describe('Angular4FlutterwaveComponent', () => {
  let component: Angular4FlutterwaveComponent;
  let fixture: ComponentFixture<Angular4FlutterwaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Angular4FlutterwaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Angular4FlutterwaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
