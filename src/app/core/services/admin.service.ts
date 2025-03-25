
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private userUrl = 'http://127.0.0.1:5000/admin/users/';
  private aiModelUrl = 'http://127.0.0.1:5000/admin/ai/';
  private logsUrl = 'http://127.0.0.1:5000/admin/logs/';
  private settingsUrl = 'http://127.0.0.1:5000/admin/settings/';
  private adminDetailsUrl = 'http://127.0.0.1:5000/admin/details/';
  private locationUrl = 'http://127.0.0.1:5000/admin/locations/';


  constructor(private http: HttpClient) {}


  getAdminDetails(): Observable<any> {
    return this.http.get(this.adminDetailsUrl)
      .pipe(catchError(this.handleError));
  }

  // User Management
  getAllUsers(): Observable<any> {
    return this.http.get(this.userUrl)
      .pipe(catchError(this.handleError));
  }

  getAllLocations(): Observable<any> {
    return this.http.get(this.locationUrl)
      .pipe(catchError(this.handleError));
  }

  banUser(userId: string): Observable<any> {
    return this.http.post(this.userUrl + 'ban', { id: userId })
      .pipe(catchError(this.handleError));
  }

  removeUser(userId: string): Observable<any> {
    return this.http.delete(this.userUrl + userId)
      .pipe(catchError(this.handleError));
  }

  // AI Model Management
  trackAiTraining(): Observable<any> {
    return this.http.get(this.aiModelUrl + 'track')
      .pipe(catchError(this.handleError));
  }

  retrainModel(data: any): Observable<any> {
    return this.http.post(this.aiModelUrl + 'retrain', data)
      .pipe(catchError(this.handleError));
  }

  // System Logs & Analytics
  getSystemLogs(): Observable<any> {
    return this.http.get(this.logsUrl)
      .pipe(catchError(this.handleError));
  }

  // Settings Management
  getSettings(): Observable<any> {
    return this.http.get(this.settingsUrl)
      .pipe(catchError(this.handleError));
  }

  updateSettings(settings: any): Observable<any> {
    return this.http.put(this.settingsUrl, settings)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', {
      message: error.message,
      status: error.status,
      url: error.url,
      detail: error.error
    });
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
