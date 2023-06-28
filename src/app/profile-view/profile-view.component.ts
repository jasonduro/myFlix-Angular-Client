import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})

export class ProfileViewComponent implements OnInit {
  user: any = {};
  favoriteMovies: any = [];

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    //public dialogRef: MatDialogRef<ProfileViewComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.fetchApiData.getUser().subscribe((user) => {
      console.log(user);
      this.user = user;
      this.userData.Username = this.user.Username;
      this.userData.Email = this.user.Email;
      this.userData.Birthday = formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0' );
    
      this.fetchApiData.getAllMovies().subscribe((response: any) => {
        this.favoriteMovies = response.filter((movie: any) => this.user.FavoriteMovies.includes(movie._id));
        return this.user;
      }); 
    });
  }
    

  updateUser(): void {
    this.fetchApiData.updateUser(this.userData).subscribe((result) => {
      console.log(result);
      localStorage.setItem('user', JSON.stringify(result));

      this.snackBar.open('User successfully updated', 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }


  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe((result) => {
      localStorage.clear();
      console.log(result.message);
      this.router.navigate(['welcome']);
      this.snackBar.open(result.message, 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open(result.message, 'OK', {
        duration: 2000
      });
    });
  } 
}


