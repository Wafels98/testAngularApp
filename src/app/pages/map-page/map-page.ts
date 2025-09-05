import { Component, OnInit, signal, effect, computed } from '@angular/core';
import { Mapcomponent } from '../../components/mapcomponent/mapcomponent';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';
import { useGeographic as olUseGeographic } from 'ol/proj';
import { apply as applyMapboxStyle } from 'ol-mapbox-style';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS'

@Component({
  selector: 'app-map-page',
  imports: [Mapcomponent],
  templateUrl: './map-page.html',
  styleUrls: ['./map-page.css']
})
export class MapPage implements OnInit {

  map!: Map;

  lon = signal(8.01);
  lat = signal(50.87);
  zoom = signal(14);

  position = computed(() => fromLonLat([this.lon(), this.lat()]));

  markerColor = '#ff0000';

  // Marker-Layer
  markerLayer = new VectorLayer({
    source: new VectorSource(),
    style: (feature) => new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: this.markerColor }),
        stroke: new Stroke({ color: 'white', width: 2 })
      })
    })
  });

  // OSM-Layer
  osmLayer = new VectorLayer({
    source: new OSM() as any, // wird nur für OSM verwendet
    visible: true
  });

  ngOnInit(): void {
    olUseGeographic();

    this.map = new Map({
      target: 'ol-map',
      view: new View({
        center: [this.lon(), this.lat()],
        zoom: this.zoom()
      })
    });

    // Basemap laden
    applyMapboxStyle(
      this.map,
      'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_top.json'
    ).then(() => {
      // Marker-Layer nach Mapbox-Style hinzufügen
      this.map.addLayer(this.markerLayer);
    });

    // Klick auf Map → Marker setzen
    this.map.on('click', (evt) => {
      const coords = toLonLat(evt.coordinate);
      this.addMarker(coords[0], coords[1]);
    });
  }

  addMarker(lon: number, lat: number) {
    const marker = new Feature({
      geometry: new Point(fromLonLat([lon, lat]))
    });

    marker.setStyle(new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: this.markerColor }),
        stroke: new Stroke({ color: 'white', width: 2 })
      })
    }));

    this.markerLayer.getSource()?.addFeature(marker);
  }

  clearMarkers() {
    this.markerLayer.getSource()?.clear();
  }

  clearLastMarker() {
    const source = this.markerLayer.getSource();
    if (source) {
      const features = source.getFeatures();
      source.removeFeature(features[features.length - 1]);
    }
  }

  // Layer wechseln zwischen OSM und basemap.de
  switchBaseMap(mapName: 'OSM' | 'Basemap' | 'DTK') {
    if (!this.map) return;

    if (mapName === 'OSM') {
      this.map.setLayers([
        new TileLayer({ source: new OSM() }),
        new TileLayer({
          source: new TileWMS({
            url: 'https://www.wms.nrw.de/geobasis/wms_nw_dvg?',
            params: { LAYERS: 'nw_dvg_bld,nw_dvg_krs' },
            attributions: '© BKG'
          })
        }),
        this.markerLayer
      ]);
    }
    else if (mapName === 'DTK') {
      this.map.setLayers([
        new TileLayer({
          source: new TileWMS({
            url: 'https://www.wms.nrw.de/geobasis/wms_nw_dtk50',
            params: { LAYERS: 'nw_dtk50_col' },
            attributions: '© BKG'
          })
        }),
        this.markerLayer
      ]);
    }
    else { // Mapbox-Style
      this.map.setLayers([]); // Mapbox-Style benötigt leere Layer
      applyMapboxStyle(
        this.map,
        'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_top.json'
      ).then(() => {
        this.map.addLayer(this.markerLayer);
      });
    }
  }
}
