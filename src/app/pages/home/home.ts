import { Component } from '@angular/core';
import { Gridview } from '../../components/gridview/gridview';
import { Sidenav } from '../../components/sidenav/sidenav';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-home',
  imports: [Gridview, Sidenav, MatDivider],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  
}
