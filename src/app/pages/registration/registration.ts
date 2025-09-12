import { Component, signal, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Button } from '../../components/button/button';
import { MatCardModule } from '@angular/material/card';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { NgIf } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-registration',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatCardModule, Button, NgIf, MatTooltip],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})
export class Registration {

  registrationSuccessful = signal(false);

  // FormControls
  readonly username = new FormControl('', [Validators.required]);
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, this.passwordValidator()]);
  readonly firstName = new FormControl('');
  readonly lastName = new FormControl('');

  errorMessage = signal('');

  constructor(private loginService: LoginService) {
    // E-Mail Fehler live beobachten
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null;

      const minLength = /.{8,}/.test(value);
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

      const valid = minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

      return valid
        ? null
        : {
          passwordStrength: {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar,
          },
        };
    }
  }

  // Registierungscall
  async registerUser() {
    try {
      const res: any = await this.loginService.addUser(
        this.firstName.value ?? '',
        this.lastName.value ?? '',
        this.email.value ?? '',
        this.username.value ?? '',
        this.password.value ?? ''
      );

      if (res) {
        console.log('Registrierung erfolgreich:', res); // <-- hier die Response ausgeben
        this.registrationSuccessful.set(true);
        this.errorMessage.set('');
      } else {
        this.errorMessage.set('Etwas ist schiefgelaufen');
      }
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      this.errorMessage.set('Etwas ist schiefgelaufen');
    }
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

  // Submit-Handling
  async onSubmit() {
    if (this.username.invalid) {
      this.errorMessage.set('Benutzername darf nicht leer sein!');
      return;
    }

    if (this.email.invalid) {
      this.updateErrorMessage();
      return;
    }

    if (this.password.invalid) {
      this.errorMessage.set('Das Passwort erfüllt nicht die Sicherheitsanforderungen!');
      return;
    }

    // Alles valide -> User registrieren
    await this.registerUser();
  }

  // Getter für den Passwort-Tooltip
  get passwordTooltipText(): string {
    const value = this.password.value || '';
    const minLength = /.{8,}/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

    const check = (condition: boolean, text: string) => condition ? `✔ ${text}` : `❌ ${text}`;

    return [
      check(minLength, 'Min. 8 Zeichen'),
      check(hasUpperCase, 'Mind. 1 Großbuchstabe'),
      check(hasLowerCase, 'Mind. 1 Kleinbuchstabe'),
      check(hasNumber, 'Mind. 1 Zahl'),
      check(hasSpecialChar, 'Mind. 1 Sonderzeichen'),
    ].join('\n');
  }

  @ViewChild('passwordTooltipRef') passwordTooltip!: MatTooltip;

  // Weiterleitung zum Login

  private router = inject(Router);

  navigateToPage(route: string) {
    this.router.navigate([route])
  }

}

