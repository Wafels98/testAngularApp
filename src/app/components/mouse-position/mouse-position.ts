import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
} from '@angular/core';
import Map from 'ol/Map';
import ControlMousePosition from 'ol/control/MousePosition';
import { CoordinateFormatterService } from '../../services/coordinate-formatter';

@Component({
  selector: 'app-mouse-position',
  template: ``,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MousePositionComponent implements OnInit {

  @Input() map: Map = new Map;
  @Input() positionTemplate: string = "";
  control: ControlMousePosition = new ControlMousePosition;

  constructor(
    private element: ElementRef,
    private coordinateFormatter: CoordinateFormatterService,
  ) {
  }

  ngOnInit() {
    this.control = new ControlMousePosition({
    className: 'mouseposition-control',
    coordinateFormat: (coord?: number[]) =>
      coord
        ? this.coordinateFormatter.numberCoordinates(coord, 4, this.positionTemplate)
        : '',
    target: this.element.nativeElement,
    placeholder: '',   
  });
    this.map.addControl(this.control);
  }
}