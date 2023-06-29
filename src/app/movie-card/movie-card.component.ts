import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

import { MatSnackBar } from '@angular/material/snack-bar';

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
      // Assuming favoriteMovies is an array of objects and each object has a $oid property
      // which is the id of a favorite movie.
      return this.favoriteMovies.some(movie => movie._id === movieId);
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
