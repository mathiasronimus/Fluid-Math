import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSuperAlignmentComponent } from './sub-super-alignment.component';

describe('SubSuperAlignmentComponent', () => {
  let component: SubSuperAlignmentComponent;
  let fixture: ComponentFixture<SubSuperAlignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSuperAlignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSuperAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
