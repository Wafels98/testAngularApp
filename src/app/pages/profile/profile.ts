import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../services/login-service';
import { Button } from '../../components/button/button';
import { Router } from '@angular/router';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [Button, MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatList, MatListItem, MatCardActions, NgIf],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

	user: any = null;

	constructor(private loginService: LoginService) {}

	async ngOnInit() {
		try {
			if (!this.loginService.isLoggedIn()) {
				throw new Error('Nicht eingeloggt');
			}

			this.user = this.loginService.currentUser || await this.loginService.fetchUser();
		} catch (err) {
			console.error('Fehler beim Laden des Profils', err);
		}
	}
  logOut() {
    this.loginService.logout();
    this.navigateToPage('/login')
  }

  private router = inject(Router);

  navigateToPage(route: string ){
    this.router.navigate([route])
  }
}
