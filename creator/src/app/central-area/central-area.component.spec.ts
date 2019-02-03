import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralAreaComponent } from './central-area.component';

describe('CentralAreaComponent', () => {
  let component: CentralAreaComponent;
  let fixture: ComponentFixture<CentralAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentralAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
