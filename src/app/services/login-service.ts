import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  isLoggedIn = signal(false);
  
  private http = inject(HttpClient);

  public loginCall(usn: string, pw: string) {
    return this.http.post(
      'https://dummyjson.com/auth/login',
      { username: usn, password: pw },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        credentials: "include"
      }
    );
  }

}
