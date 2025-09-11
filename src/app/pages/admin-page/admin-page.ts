import { Component } from '@angular/core';
import { LoginService } from '../../services/login-service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-page',
  imports: [NgIf],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.css'
})
export class AdminPage {
  isAdmin = false;
  checkedRole = false;

  constructor(private loginService: LoginService) { }

  async ngOnInit() {
    try {

      if (!this.loginService.isLoggedIn()) {
        throw new Error('Nicht eingeloggt');
      }

      await this.loginService.fetchUser();
      
      const role = this.loginService.getUserRole();
      this.isAdmin = role === 'admin';
      console.log('Role: ' + role)
    
    } catch (err) {
      this.isAdmin = false;
      console.log('Fehler: '+ err)
    } finally {
      this.checkedRole = true;
    }
  }
}

