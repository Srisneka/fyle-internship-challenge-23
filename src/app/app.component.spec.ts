import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [ApiService]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call ApiService getUser method on search', fakeAsync(() => {
    const username = 'testUser';
    component.searchUsername = username;
    const userData = { login: username };

    spyOn(apiService, 'getUser').and.returnValue(of(userData));
    spyOn(apiService, 'getRepos').and.returnValue(of([]));

    component.search();
    tick();

    expect(apiService.getUser).toHaveBeenCalledWith(username);
    expect(apiService.getRepos).toHaveBeenCalledWith(username, 1, component.pageSize);
    expect(component.user).toEqual(userData);
  }));

  it(`should have a title 'fyle-frontend-challenge'`, () => {
    expect(component.title).toEqual('fyle-frontend-challenge');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('fyle-frontend-challenge app is running!');
  });

  it('should calculate repository rows correctly', () => {
    const repositories = [
      { name: 'repo1', description: 'description1' },
      { name: 'repo2', description: 'description2' },
      { name: 'repo3', description: 'description3' }
    ];

    component.repositories = repositories;
    component.calculateRepositoryRows();

    expect(component.repositoryRows.length).toBe(2);
    expect(component.repositoryRows[0]).toEqual(repositories.slice(0, 2));
    expect(component.repositoryRows[1]).toEqual(repositories.slice(2));
  });

  it('should update page number and trigger search on next page', () => {
    spyOn(component, 'search');
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.search).toHaveBeenCalled();
  });

  it('should update page number and trigger search on previous page', () => {
    spyOn(component, 'search');
    component.currentPage = 2;
    component.previousPage();
    expect(component.currentPage).toBe(1);
    expect(component.search).toHaveBeenCalled();
  });

  it('should reset page number and trigger search on changing page size', () => {
    spyOn(component, 'search');
    component.currentPage = 2;
    component.pageSize = 20;
    component.changePageSize();
    expect(component.currentPage).toBe(1);
    expect(component.search).toHaveBeenCalled();
  });
});
