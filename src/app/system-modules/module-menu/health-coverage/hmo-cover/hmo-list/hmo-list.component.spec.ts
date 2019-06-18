import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoListComponent } from './hmo-list.component';

describe('HmoListComponent', () => {
  let component: HmoListComponent;
  let fixture: ComponentFixture<HmoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
