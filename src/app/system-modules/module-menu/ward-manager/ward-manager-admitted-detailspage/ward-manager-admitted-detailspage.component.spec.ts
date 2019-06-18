import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WardManagerAdmittedDetailspageComponent } from './ward-manager-admitted-detailspage.component';

describe('WardManagerAdmittedDetailspageComponent', () => {
  let component: WardManagerAdmittedDetailspageComponent;
  let fixture: ComponentFixture<WardManagerAdmittedDetailspageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WardManagerAdmittedDetailspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WardManagerAdmittedDetailspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
