import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageHomeComponent } from './home-page-home.component';

describe('HomePageHomeComponent', () => {
  let component: HomePageHomeComponent;
  let fixture: ComponentFixture<HomePageHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
