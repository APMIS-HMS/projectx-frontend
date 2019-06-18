import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLogoComponent } from './add-logo.component';

describe('VerifyTokenComponent', () => {
  let component: AddLogoComponent;
  let fixture: ComponentFixture<AddLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLogoComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
