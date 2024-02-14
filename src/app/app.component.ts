import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fyle-frontend-challenge';
  searchUsername: string = '';
  loading: boolean = false;
  error: string = '';
  repositories: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalRepositories: number = 0;
  pageSizes: number[] = [5,10,15,20,25,50,75,100];
  totalPages: number = 0;
  userProfile: any = {};
  userAvatarUrl: string = '';  
  user: any;
  repositoryRows: any[][] = [];

  

  constructor(private apiService: ApiService) {}

  ngOnInit() {
  }
  search() {
    this.loading = true;
    this.error = '';
    this.repositories = [];
    this.apiService.getUser(this.searchUsername).subscribe(
      (user: any) => {
        this.userAvatarUrl = user.avatar_url;
        this.user = user;
        this.userProfile = user; 
        const username = user.login;
        this.apiService.getRepos(username, this.currentPage, this.pageSize).subscribe(
          (repos: any) => {
            this.repositories = repos as any[];
            this.totalRepositories = user.public_repos;
            this.totalPages = Math.ceil(this.totalRepositories / this.pageSize);
            this.loading = false;
            this.calculateRepositoryRows();
          },
          (error: any) => {
            this.error = 'Error fetching repositories';
            this.loading = false;
          }
        );
      },
      (error: any) => {
        this.error = 'User not found';
        this.loading = false;
      }
    );
    
  }
  calculateRepositoryRows() {
    this.repositoryRows = [];
    for (let i = 0; i < this.repositories.length; i += 2) {
      this.repositoryRows.push(this.repositories.slice(i, i + 2));
    }
  }

  
  nextPage() {
    this.currentPage++;
    this.search();
  }

  previousPage() {
    this.currentPage--;
    this.search();
  }

  changePageSize() {
    this.currentPage = 1; 
    this.search();
  }
}

