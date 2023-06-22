import { Component, OnInit, Input } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { UserRegistrationService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {   
  
    @Input() userData = { Username: '', Password: '' };
  
    constructor(
      public fetchApiData: UserRegistrationService,
      public dialogRef: MatDialogRef<UserLoginFormComponent>,
      public snackBar: MatSnackBar) { }
  
    ngOnInit(): void {
    }
  
    // This is the function responsible for sending the form inputs to the backend
    loginUser(): void {
      this.fetchApiData.loginUser(this.userData).subscribe((response) => {
        // Logic for a successful user login goes here! (To be implemented)
        console.log(response);
        this.dialogRef.close(); // This will close the modal on success!
        localStorage.setItem('user', response.user.Username);
        localStorage.setItem('token', response.token);
        this.snackBar.open('user logged in successfully', 'OK', {
          duration: 2000
        });
      }, (response) => {
        console.log(response);
        this.snackBar.open(response, 'OK', {
          duration: 2000
        });
      });
    }

}
