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
        map((result) => {
          // save the user data in local storage
          localStorage.setItem('user', JSON.stringify(result));
          return result;
        }),
        catchError(this.handleError)
      );
  }
  
  // API Call for get all movies endpoint
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

  // API Call for get one movie endpoint
  getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
      return this.http.get(apiUrl + `movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      }).pipe(catchError(this.handleError)
    );
  }

  // API Call for get one director endpoint
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

  // API Call for get one genre endpoint
  getGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `/genres/${name}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
      }).pipe(catchError(this.handleError)
    );
  }

  // API Call for get one user endpoint
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

    // API Call for edit user endpoint
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
    
    // API Call for delete user endpoint
    deleteUser(): Observable<any> {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      return this.http.delete(apiUrl + `users/${user}`, {
        headers: new HttpHeaders(
          {
            Authorization: 'Bearer ' + token,
          })
        }).pipe(catchError(this.handleError)
        );
    }  

  // API Call for get favorite movies endpoint
  getFavoriteMovies(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `users/${userId}/movies`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // API Call for add favorite movies endpoint
  addFavoriteMovie(userId: string, movieId: string): Observable<any> {
    return this.http.post<any>(`${apiUrl}/users/${userId}/movies/${movieId}`, {})
      .pipe(catchError(this.handleError));
  }

  // API Call for delete favorite movies endpoint
  deleteFavoriteMovie(userId: string, movieId: string): Observable<any> {
    return this.http.delete(`${apiUrl}/users/${userId}/movies/${movieId}`)
      .pipe(catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

  // Error handling
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${JSON.stringify(error.error)}`);
    }
    return throwError(
    'An error has occurred ; please try again later.');
}

}