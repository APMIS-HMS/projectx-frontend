import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightTabTooltipComponent } from './right-tab-tooltip.component';

describe('RightTabTooltipComponent', () => {
  let component: RightTabTooltipComponent;
  let fixture: ComponentFixture<RightTabTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightTabTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightTabTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
