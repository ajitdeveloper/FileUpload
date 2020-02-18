import { TestBed } from '@angular/core/testing';

import { ConfirmservService } from './confirmserv.service';

describe('ConfirmservService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfirmservService = TestBed.get(ConfirmservService);
    expect(service).toBeTruthy();
  });
});
