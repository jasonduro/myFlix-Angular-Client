import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent {
  movies: any[] = [];
  constructor(public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar, 
    public dialog: MatDialog    
    ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  favoriteMovies: any[] = [];
  userId: string = localStorage.getItem('userId') || '';

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.movies = response;
      console.log(this.movies);
      return this.movies;
    });
  }

  openGenre(name: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: description
      },
    })
  }

    openDirector(name: string, bio: string): void {
      this.dialog.open(MovieInfoComponent, {
        data: {
          title: name,
          content: bio
        },
      });
    }

    openSynopsis(description: string): void {
      this.dialog.open(MovieInfoComponent, {
        data: {
          title: 'Synopsis',
          content: description
        },
      });
    }

    addFavoriteMovie(movieId: string): void {
      let username = localStorage.getItem('user'); 
      let token = localStorage.getItem('token');
      console.log('Token:', token);
      console.log('Movie ID:', movieId);
      console.log('Username:', username);
      if (username) {
      this.fetchApiData.addFavoriteMovie(username, movieId).subscribe((result) => {
        console.log(result);
  
        this.snackBar.open('Movie added to favorites.', 'OK', {
          duration: 2000
        });
        this.favoriteMovies = result.FavoriteMovies;
      });
    }
  }
        
  isFavoriteMovie(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }
    
  
    deleteFavoriteMovie(movieId: string): void {
      let username = localStorage.getItem('user'); // get the username from localStorage
      console.log('Username:', username); 
      if (username) {
      this.fetchApiData.deleteFavoriteMovie(username, movieId).subscribe((result) => {
        this.snackBar.open('Movie removed from favorites.', 'OK', {
          duration: 2000
        });
        // Assuming that result is the updated user document
        this.favoriteMovies = result.FavoriteMovies;
      });
    }
  }
}
