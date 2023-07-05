import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

/** The API URL that will provide data for the client app */
const apiUrl = 'https://myflix-app-jl.herokuapp.com/';
@Injectable({ providedIn: 'root' })
/**
 * FetchApiDataService class.
 * 
 * This class is responsible for all API calls to the backend.
 */
export class FetchApiDataService {
  
  /**
   * Constructor. Inject the HttpClient module to the constructor params
   * @param http - The HttpClient module
   */
 constructor(private http: HttpClient) {}
 

  /**
   * Make an API call for the user registration endpoint
   * @param userDetails - Details of the user to register
   * @returns An Observable of the HTTP request response
   */
 public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  /**
   * Make an API call for the user login endpoint
   * @param userDetails - Details of the user to login
   * @returns An Observable of the HTTP request response
   */
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
  
  /**
   * Make an API call to get all movies
   * @returns An Observable of the HTTP request response
   */
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

  /**
   * Make an API call to get one movie
   * @param title - The title of the movie
   * @returns An Observable of the HTTP request response
   */
  getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
      return this.http.get(apiUrl + `movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      }).pipe(catchError(this.handleError)
    );
  }

  /**
   * Make an API call to get one director
   * @param name - The name of the director
   * @returns An Observable of the HTTP request response
   */
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

  /**
   * Make an API call to get one genre
   * @param name - The name of the genre
   * @returns An Observable of the HTTP request response
   */
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

  /**
   * Make an API call to get one user
   * @returns An Observable of the HTTP request response
   */
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

  /**
   * Make an API call to update a user
   * @param updatedUser - The updated details of the user
   * @returns An Observable of the HTTP request response
   */
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
    
  /**
   * Make an API call to delete a user
   * @returns An Observable of the HTTP request response
   */
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

  /**
   * Make an API call to add a favorite movie
   * @param Username - The username of the user
   * @param movieId - The ID of the movie to add to favorites
   * @returns An Observable of the HTTP request response
   */
addFavoriteMovie(Username: string, movieId: string): Observable<any> {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
        Authorization: 'Bearer ' + token,
  })
  return this.http.post<any>(apiUrl + `users/${Username}` + `/movies/${movieId}`, {}, { headers }) 
.pipe(catchError(this.handleError));
}

  /**
   * Make an API call to delete a favorite movie
   * @param Username - The username of the user
   * @param movieId - The ID of the movie to remove from favorites
   * @returns An Observable of the HTTP request response
   */
deleteFavoriteMovie(Username: string, movieId: string): Observable<any> {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return this.http.delete(apiUrl + `users/${Username}` + `/movies/${movieId}`, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(catchError(this.handleError));
}
  /**
   * Extract the response data
   * @param res - The HTTP response
   * @returns The body of the HTTP response
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

  /**
   * Handle HTTP errors
   * @param error - The HTTP error
   * @returns An Observable of the error message
   */
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