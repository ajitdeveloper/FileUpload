import { TestBed } from '@angular/core/testing';

import { ImageDimensionService } from './image-dimension.service';

describe('ImageDimensionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageDimensionService = TestBed.get(ImageDimensionService);
    expect(service).toBeTruthy();
  });
});
