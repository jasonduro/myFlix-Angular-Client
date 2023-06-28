import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflix-app-jl.herokuapp.com/';
@Injectable({ providedIn: 'root' })

export class FetchApiDataService {
  
// Inject the HttpClient module to the constructor params
// This will provide HttpClient to the entire class, making it available via this.http
 constructor(private http: HttpClient) {}
 
 // Making the api call for the user registration endpoint
 public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

// Making the api call for the user login endpoint  
  public loginUser(userDetails: any): Observable<any> {
    return this.http.post<any>(apiUrl + 'login', userDetails)
      .pipe(
        map((response) => {
          // save the user data in local storage
          localStorage.setItem('user', JSON.stringify(response));
          return response;
        }),
        catchError(this.handleError)
      );
  }
  
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
        })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)  
      );
  }

  getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
      return this.http.get(apiUrl + `movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      }).pipe(catchError(this.handleError)
    );
  }

  // Double Check the / directors and see if a double // is showing up - this could be the error. need to change for all endpoints below
  getDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `movies/director/` + `${name}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  getGenre(name: string): Observable<any> {
    return this.http.get<any>(`${apiUrl}/genres/${name}`)
      .pipe(catchError(this.handleError));
  }

  getUser(): Observable<any> {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!user || !token) {
      return throwError('User or token not found');
    }

    return this.http.get(apiUrl + `users/${user}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }  

  getFavoriteMovies(userId: string): Observable<any> {
    return this.http.get<any>(`${apiUrl}/users/${userId}/movies`)
      .pipe(catchError(this.handleError));
  }

  addFavoriteMovie(userId: string, movieId: string): Observable<any> {
    return this.http.post<any>(`${apiUrl}/users/${userId}/movies/${movieId}`, {})
      .pipe(catchError(this.handleError));
  }

  updateUser(updatedUser: any): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    console.log(updatedUser);
    return this.http.put(apiUrl + `users/${username}`, updatedUser, {
      headers: new HttpHeaders(
        {
          Authorization: `Bearer ${token}`,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  

  deleteUser(): Observable<any> {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + `users/${user}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  deleteFavoriteMovie(userId: string, movieId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl}/users/${userId}/movies/${movieId}`)
      .pipe(catchError(this.handleError));
  }

  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error.message || error.error}`); // if message property doesn't exist, print the entire error object
    }
    return throwError(
    'Something bad happened; please try again later.');
}

}