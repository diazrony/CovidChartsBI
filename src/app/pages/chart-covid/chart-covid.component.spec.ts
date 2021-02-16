import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCovidComponent } from './chart-covid.component';

describe('ChartCovidComponent', () => {
  let component: ChartCovidComponent;
  let fixture: ComponentFixture<ChartCovidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartCovidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartCovidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
