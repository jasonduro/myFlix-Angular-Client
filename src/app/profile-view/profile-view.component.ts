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

  @Input() updatedUser = { Username: '', Password: '', Email: '', Birthday: '' };

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
      this.updatedUser.Username = this.user.Username;
      this.updatedUser.Email = this.user.Email;
      this.updatedUser.Birthday = formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en' );
    
      this.fetchApiData.getAllMovies().subscribe((response: any) => {
        this.favoriteMovies = response.filter((movie: any) => this.user.FavoriteMovies.includes(movie._id));
        return this.user;
      }); 
    });
  }
    

  updateUser(): void {
    this.fetchApiData.updateUser(this.updatedUser).subscribe((response) => {
      console.log(response);
      localStorage.setItem('user', (response));

      this.snackBar.open('User successfully updated', 'OK', {
        duration: 2000
      });
    }, (response) => {
      this.snackBar.open(response, 'OK', {
        duration: 2000
      });
    });
  }


  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe((response) => {
      this.snackBar.open('Profile deleted successfully!', 'OK', {
        duration: 2000
      });
      this.router.navigate(['welcome']);
      localStorage.clear();
    }, (response) => {
      this.snackBar.open(response, 'OK', {
        duration: 2000
      });
    });
  } 
}


