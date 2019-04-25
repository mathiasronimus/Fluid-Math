import { TestBed } from '@angular/core/testing';

import { FontUpdateService } from './font-update.service';

describe('FontUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FontUpdateService = TestBed.get(FontUpdateService);
    expect(service).toBeTruthy();
  });
});
