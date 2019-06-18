import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WardManagerListpageComponent } from './ward-manager-listpage.component';

describe('WardManagerListpageComponent', () => {
  let component: WardManagerListpageComponent;
  let fixture: ComponentFixture<WardManagerListpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WardManagerListpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WardManagerListpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
