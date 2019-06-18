import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WardManagerAdmittedpageComponent } from './ward-manager-admittedpage.component';

describe('WardManagerAdmittedpageComponent', () => {
  let component: WardManagerAdmittedpageComponent;
  let fixture: ComponentFixture<WardManagerAdmittedpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WardManagerAdmittedpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WardManagerAdmittedpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
