import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreHomeMainComponent } from './store-home-main.component';

describe('StoreHomeMainComponent', () => {
  let component: StoreHomeMainComponent;
  let fixture: ComponentFixture<StoreHomeMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreHomeMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreHomeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
