import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'YOUR_HOSTED_API_URL_HERE/';
@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }
 // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  public loginUser(userDetails: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  public getAllMovies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movies`)
      .pipe(catchError(this.handleError));
  }

  public getMovie(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movies/${id}`)
      .pipe(catchError(this.handleError));
  }

  public getDirector(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/directors/${id}`)
      .pipe(catchError(this.handleError));
  }

  public getGenre(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/genres/${id}`)
      .pipe(catchError(this.handleError));
  }

  public getUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  public getFavouriteMovies(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}/movies`)
      .pipe(catchError(this.handleError));
  }

  public addFavouriteMovie(userId: string, movieId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/movies/${movieId}`, {})
      .pipe(catchError(this.handleError));
  }

  public editUser(userId: string, userDetails: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, userDetails)
      .pipe(catchError(this.handleError));
  }

  public deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`)
      .pipe(catchError(this.handleError));
  }

  public deleteFavouriteMovie(userId: string, movieId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}/movies/${movieId}`)
      .pipe(catchError(this.handleError));
  }

private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }
}