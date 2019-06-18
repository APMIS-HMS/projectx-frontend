import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WardManagerComponent } from './ward-manager.component';

describe('WardManagerComponent', () => {
  let component: WardManagerComponent;
  let fixture: ComponentFixture<WardManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WardManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WardManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
