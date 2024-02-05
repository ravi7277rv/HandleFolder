import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileFolderServiceService {

  constructor(
    private http: HttpClient,
    handler: HttpBackend
  ) {
    this.http = new HttpClient(handler)
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened. Please try again later.');
  }


  baseUrl = 'http://localhost:5500';

  uploadSingleFile = (formData:any) => {
    return this.http.post(`${this.baseUrl}/uploadfile`,formData);
  }

  uploadArrayOfFiles = (formData:any) => {
    return this.http.post(`${this.baseUrl}/uploadFiles`,formData);
  }
}
