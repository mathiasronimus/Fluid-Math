import { TestBed } from '@angular/core/testing';

import { SelectedStepService } from './selected-step.service';

describe('SelectedStepService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectedStepService = TestBed.get(SelectedStepService);
    expect(service).toBeTruthy();
  });
});
