import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WardManagerAdmissionpageComponent } from './ward-manager-admissionpage.component';

describe('WardManagerAdmissionpageComponent', () => {
  let component: WardManagerAdmissionpageComponent;
  let fixture: ComponentFixture<WardManagerAdmissionpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WardManagerAdmissionpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WardManagerAdmissionpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
