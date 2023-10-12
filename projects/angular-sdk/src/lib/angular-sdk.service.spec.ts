import { TestBed } from '@angular/core/testing';

import { AngularSdkService } from './angular-sdk.service';

describe('AngularSdkService', () => {
  let service: AngularSdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularSdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
