import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { Button } from '../../components/button/button';
import { MatCardModule } from '@angular/material/card';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatCardModule, Button],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  username = signal('');
  password = signal('');

  constructor(private loginService: LoginService) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('Es muss eine Email-Adresse angegeben werden!');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Keine gültige Email-Adresse');
    } else {
      this.errorMessage.set('');
    }
  }

  async onLogin() {
    try {
      await this.loginService.loginCallAsync(this.username(), this.password());
      console.log('Login erfolgreich!');
      const role = this.loginService.getUserRole();
      console.log('User-Rolle:', role);
      this.navigateToPage('/profile')
    } catch (err) {
      console.error('Login fehlgeschlagen', err);
    }

  }

  async onLoginRandom() {
    try {
      // Alle User von DummyJSON laden
      const res: any = await this.loginService.http.get('https://dummyjson.com/users?limit=0').toPromise();
      const users = res.users as any[];

      if (!users || users.length === 0) {
        throw new Error('Keine User gefunden');
      }

      // Zufälligen User auswählen
      const randomUser = users[Math.floor(Math.random() * users.length)];

      // CurrentUser im LoginService setzen
      this.loginService.currentUser = randomUser;

      this.loginService.accessToken.set(res.accessToken);
      this.loginService.refreshToken.set(res.refreshToken);
      this.loginService.isLoggedIn.set(true);

      // Tokens auch in LocalStorage speichern
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      
      console.log('Zufälliger Login erfolgreich!', randomUser);

      // Optional: Rolle setzen oder ableiten
      const role = this.loginService.getUserRole?.() ?? 'user';
      console.log('User-Rolle:', role);

      // Weiterleiten zum Profil
      this.navigateToPage('/profile');
    } catch (err) {
      console.error('Zufälliger Login fehlgeschlagen', err);
    }
  }

  private map!: Map;

  ngOnInit(): void {
    // gewünschte Koordinaten (Longitude, Latitude)
    const lon = 8.01;
    const lat = 50.87;

    this.map = new Map({
      target: 'osm-background',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([lon, lat]), // Umrechnung nach EPSG:3857
        zoom: 14                        // Zoomstufe anpassen
      })
    });
  }


  private router = inject(Router);

  navigateToPage(route: string) {
    this.router.navigate([route])
  }

}
