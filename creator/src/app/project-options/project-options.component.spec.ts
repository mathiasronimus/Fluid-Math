import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOptionsComponent } from './project-options.component';

describe('ProjectOptionsComponent', () => {
  let component: ProjectOptionsComponent;
  let fixture: ComponentFixture<ProjectOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
