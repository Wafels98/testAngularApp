import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import {MatDividerModule} from '@angular/material/divider';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, MatDividerModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('testAngularApp');
  private isLogedIn = signal(false);
}
