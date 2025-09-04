import { TestBed } from '@angular/core/testing';

import { CoordinateFormatter } from './coordinate-formatter';

describe('CoordinateFormatter', () => {
  let service: CoordinateFormatter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoordinateFormatter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
