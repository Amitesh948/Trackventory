import { TestBed } from '@angular/core/testing';

import { SetInterceptorService } from './set-interceptor.service';

describe('SetInterceptorService', () => {
  let service: SetInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
