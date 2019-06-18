import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FcListComponent } from './fc-list.component';

describe('FcListComponent', () => {
  let component: FcListComponent;
  let fixture: ComponentFixture<FcListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FcListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
