import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user data', () => {
    const testData = { login: 'testUser' };

    service.getUser('testUser').subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne('https://api.github.com/users/testUser');
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should handle HTTP error for getUser', () => {
    const errorMessage = 'Http failure response for https://api.github.com/users/testUser: 404 Not Found';
    const username = 'testUser';

    service.getUser(username).subscribe(
      data => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.message).toEqual(errorMessage);
      }
    );

    const req = httpMock.expectOne('https://api.github.com/users/testUser');
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('should return repositories data', () => {
    const testData = [{ name: 'repo1' }, { name: 'repo2' }];

    service.getRepos('testUser', 1, 10).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne('https://api.github.com/users/testUser/repos?page=1&per_page=10');
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should handle HTTP error for getRepos', () => {
    const errorMessage = 'Http failure response for https://api.github.com/users/testUser/repos?page=1&per_page=10: 500 Internal Server Error';
    const username = 'testUser';

    service.getRepos(username, 1, 10).subscribe(
      data => fail('should have failed with the error'),
      (error: HttpErrorResponse) => {
        expect(error.message).toEqual(errorMessage);
      }
    );

    const req = httpMock.expectOne('https://api.github.com/users/testUser/repos?page=1&per_page=10');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });
});
