import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-gridview',
  imports: [MatGridListModule, MatDividerModule],
  templateUrl: './gridview.html',
  styleUrl: './gridview.css'
})
export class Gridview {
}
