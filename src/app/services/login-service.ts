import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn = signal(false);
  accessToken = signal('');
  refreshToken = signal('');
  currentUser: any = null; // speichert User-Daten nach Login

  constructor() {
    const token = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');

    if (token) {
      this.accessToken.set(token);
      this.refreshToken.set(refresh || '');
      this.isLoggedIn.set(true);

      // Optional: User-Daten neu laden
      this.fetchUser().catch(() => {
        this.logout(); // bei Fehlern sauber ausloggen
      });
    }
  }

  http = inject(HttpClient);

  // Login-Methode: speichert Tokens intern
  public async loginCallAsync(username: string, password: string) {
    const res: any = await firstValueFrom(this.http.post<any>(
      'https://dummyjson.com/auth/login',
      { username, password },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include'
      }
    ));

    // Tokens und Login-Status setzen
    this.accessToken.set(res.accessToken);
    this.refreshToken.set(res.refreshToken);
    this.isLoggedIn.set(true);

    // Tokens auch in LocalStorage speichern
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    // Optional: User-Daten gleich abrufen
    await this.fetchUser();

    return res;
  }

  // User-Daten von der API abrufen
  public async fetchUser() {
    if (!this.accessToken()) {
      throw new Error('Kein Access-Token vorhanden!');
    }

    const user: any = await firstValueFrom(this.http.get<any>(
      'https://dummyjson.com/auth/me',
      {
        headers: { 'Authorization': 'Bearer ' + this.accessToken() },
        credentials: 'include'
      }
    ));

    this.currentUser = user;
    return user;
  }

  // Rolle des Users abrufen
  public getUserRole(): string {
    if (!this.currentUser) {
      throw new Error('User-Daten noch nicht geladen!');
    }
    return this.currentUser.role || '';
  }

  // Logout: alles zurücksetzen
  public logout() {
    this.accessToken.set('');
    this.refreshToken.set('');
    this.isLoggedIn.set(false);
    this.currentUser = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
