import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://127.0.0.1:5000/users/';

  constructor(private http: HttpClient) { }

  register(user: any) {
    return this.http.post(this.url + 'register', user);
  }

  login(user: any): Observable<any> {
    return this.http.post(this.url + 'login', user)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserById(id: any): Observable<any> {
    return this.http.get(this.url + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  editUser(id: any, userData: any): Observable<any> {
    return this.http.put(this.url + id, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.put(this.url + 'update-role', { userId, role })
      .pipe(
        catchError(this.handleError)
      );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  isAdmin(): boolean {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return false;
    }
    const user = JSON.parse(storedUser);
    console.log('Current user role:', user.role || 'no role');
    return user.role === 'admin';
  }

  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return JSON.parse(window.atob(token.split('.')[1])).id;
      } catch (e) {
        console.error('Error decoding token', e);
        return null;
      }
    }
    return null;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Server-side error: ${error.status}\n${error.message}`);
      errorMessage = error.error?.message || error.message;
    }
    return throwError(errorMessage);
  }
}