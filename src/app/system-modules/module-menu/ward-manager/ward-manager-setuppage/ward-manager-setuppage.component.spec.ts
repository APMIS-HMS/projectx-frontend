import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WardManagerSetuppageComponent } from './ward-manager-setuppage.component';

describe('WardManagerSetuppageComponent', () => {
  let component: WardManagerSetuppageComponent;
  let fixture: ComponentFixture<WardManagerSetuppageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WardManagerSetuppageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WardManagerSetuppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
