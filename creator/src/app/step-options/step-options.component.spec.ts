import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOptionsComponent } from './step-options.component';

describe('StepOptionsComponent', () => {
  let component: StepOptionsComponent;
  let fixture: ComponentFixture<StepOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
