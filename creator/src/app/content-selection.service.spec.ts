import { TestBed } from '@angular/core/testing';

import { ContentSelectionService } from './content-selection.service';

describe('ContentSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentSelectionService = TestBed.get(ContentSelectionService);
    expect(service).toBeTruthy();
  });
});
