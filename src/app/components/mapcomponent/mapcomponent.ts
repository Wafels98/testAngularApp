import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef } from '@angular/core';
import Map from 'ol/Map';

@Component({
  selector: 'app-mapcomponent',
  template: '',
  styles: [':host { width: 100%; height: 100%; display: block; }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Mapcomponent implements OnInit {
  @Input() map: Map = new Map;
  constructor(private elementRef: ElementRef) {
  }
  ngOnInit() {
    this.map.setTarget(this.elementRef.nativeElement);
  }
}
