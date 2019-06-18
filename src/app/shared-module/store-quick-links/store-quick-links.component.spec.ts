import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreQuickLinksComponent } from './store-quick-links.component';

describe('StoreQuickLinksComponent', () => {
  let component: StoreQuickLinksComponent;
  let fixture: ComponentFixture<StoreQuickLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreQuickLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreQuickLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
