import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAddComponent } from './table-add.component';

describe('TableAddComponent', () => {
  let component: TableAddComponent;
  let fixture: ComponentFixture<TableAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
