import { TestBed } from '@angular/core/testing';

import { FirebaseBaseService } from './firebase-base.service';

describe('FirebaseBaseService', () => {
  let service: FirebaseBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
