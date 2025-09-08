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
  password = signal('')

  constructor(private loginService: LoginService) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  loginRequest() {
  const usn = this.username();
  const pw = this.password();
  console.log('Login mit:', usn, pw);

  this.loginService.loginCall(usn, pw).subscribe({
    next: data => {
      console.log('Antwort: ', data);
      this.loginService.isLoggedIn.set(true); 
      this.navigateToPage("/profile");
    },
    error: err => {
      console.error('Fehler: ', err);
      this.loginService.isLoggedIn.set(false);
    }
  });
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

  navigateToPage(route: string ){
    this.router.navigate([route])
  }

}
