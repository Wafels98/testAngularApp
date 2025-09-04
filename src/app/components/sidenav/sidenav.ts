import { Component } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSliderModule} from '@angular/material/slider';


@Component({
  selector: 'app-sidenav',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatSliderModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css'
})
export class Sidenav {

}
