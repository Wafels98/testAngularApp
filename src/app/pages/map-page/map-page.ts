import { Component, OnInit, signal, computed } from '@angular/core';
import { Mapcomponent } from '../../components/mapcomponent/mapcomponent';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Circle as CircleStyle, Fill, Stroke, Icon } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';
import { useGeographic as olUseGeographic } from 'ol/proj';
import { apply as applyMapboxStyle } from 'ol-mapbox-style';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { LoginService } from '../../services/login-service';


@Component({
  selector: 'app-map-page',
  imports: [Mapcomponent],
  templateUrl: './map-page.html',
  styleUrls: ['./map-page.css']
})
export class MapPage implements OnInit {
  constructor(private loginService: LoginService) { }

  map!: Map;

  lon = signal(8.01);
  lat = signal(50.87);
  zoom = signal(14);

  markerColor = '#ff0000';

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

  userLayerUsers: Feature[] = [];
  currentUserIndex: number = -1;
  currentUserFeature!: Feature;

  userLayer = new VectorLayer({
    source: new VectorSource(),
    style: (feature) => {
      const isCurrentUser = feature.get('currentUser');
      const color = isCurrentUser ? '#ff0000' : '#00ff00'; // Rot = aktueller, Grün = andere
      return new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: 'white', width: 2 })
        })
      });
    }
  });

  ngOnInit(): void {
    // Map erstellen
    this.map = new Map({
      target: 'ol-map',
      view: new View({
        center: fromLonLat([this.lon(), this.lat()]),
        zoom: this.zoom()
      })
    });

    // OSM + Marker-Layer + User-Layer
    this.switchBaseMap('OSM');

    // Klick auf Map → Marker setzen
    this.map.on('click', (evt) => {
      const coords = toLonLat(evt.coordinate);
      this.addMarker(coords[0], coords[1]);
    });

    // Aktueller User
    const currentUser = this.loginService.currentUser as any;

    if (currentUser) {
      const coordsCurrent = this.getUserCoordinates(currentUser);
      if (coordsCurrent) {
        this.currentUserFeature = this.addUserMarker(
          coordsCurrent[0],
          coordsCurrent[1],
          true,
          currentUser.firstName,
          currentUser.lastName,
          currentUser.image
        )
        this.userLayerUsers.push(this.currentUserFeature);
        this.currentUserIndex = 0; // Start beim aktuellen User
        this.centerMapOnFeature(this.currentUserFeature);
      }
    }

    const role = this.loginService.getUserRole();

    if (role == 'admin' || role == 'moderator') {
      // Dummy-API-User laden
      this.loginService.http.get('https://dummyjson.com/users?limit=208').subscribe((res: any) => {
        const users = res.users as any[];

        users.forEach(u => {
          if (currentUser && u.id === currentUser.id) return;

          const coords = this.getUserCoordinates(u);
          if (coords) {
            const f = this.addUserMarker(
              coords[0],
              coords[1],
              false,
              u.firstName,
              u.lastName,
              u.image
            );
            this.userLayerUsers.push(f);
          }
        });
      });
    }
  }


  getUserCoordinates(user: any): [number, number] | null {
    if (!user) return null;

    // Prüfen auf direkte lon/lat-Eigenschaften
    if ('lon' in user && 'lat' in user) {
      return [user.lon, user.lat];
    }

    // Prüfen auf verschachtelte API-Koordinaten
    if (user.address?.coordinates) {
      const lng = user.address.coordinates.lng;
      const lat = user.address.coordinates.lat;
      return [lng, lat];
    }

    return null;
  }

  // Center auf Feature setzen
  centerMapOnFeature(feature: Feature) {
    const geom = feature.getGeometry() as Point;
    this.map.getView().animate({ center: geom.getCoordinates(), duration: 500 });
  }

  // User wechseln
  prevUser() {
    if (this.userLayerUsers.length === 0) return;
    this.currentUserIndex = (this.currentUserIndex - 1 + this.userLayerUsers.length) % this.userLayerUsers.length;
    this.centerMapOnFeature(this.userLayerUsers[this.currentUserIndex]);
  }

  nextUser() {
    if (this.userLayerUsers.length === 0) return;
    this.currentUserIndex = (this.currentUserIndex + 1) % this.userLayerUsers.length;
    this.centerMapOnFeature(this.userLayerUsers[this.currentUserIndex]);
  }

  goToCurrentUser() {
    if (!this.currentUserFeature) return;
    this.currentUserIndex = 0;
    this.centerMapOnFeature(this.currentUserFeature);
  }

  // Angepasste addUserMarker-Funktion, um Feature zurückzugeben
  addUserMarker(lon: number, lat: number, isCurrentUser: boolean, firstName?: string, lastName?: string, imageUrl?: string): Feature {
    const feature = new Feature({
      geometry: new Point(fromLonLat([lon, lat]))
    });

    feature.set('currentUser', isCurrentUser);
    feature.set('name', firstName && lastName ? `${firstName} ${lastName}` : 'User');

    // Style mit Profilbild-Icon
    if (imageUrl) {
      feature.setStyle(
        new Style({
          image: new Icon({
            src: imageUrl,
            scale: 0.3, // ggf. anpassen (0.05–0.15 ausprobieren)
            crossOrigin: 'anonymous' // wichtig wegen CORS
          })
        })
      );
    } else {
      // Fallback: Kreis wenn kein Bild
      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: isCurrentUser ? '#ff0000' : '#00ff00' }),
            stroke: new Stroke({ color: 'white', width: 2 })
          })
        })
      );
    }

    this.userLayer.getSource()?.addFeature(feature);
    return feature;
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

  // Layer wechseln zwischen OSM und Mapbox/DTK
  switchBaseMap(mapName: 'OSM' | 'Basemap' | 'DTK') {
    if (!this.map) return;

    const layers: any[] = [];

    if (mapName === 'OSM') {
      layers.push(
        new TileLayer({ source: new OSM() }),
        this.markerLayer,
        this.userLayer // nur OSM
      );
      this.map.setLayers(layers);
    } else if (mapName === 'DTK') {
      layers.push(
        new TileLayer({
          source: new TileWMS({
            url: 'https://www.wms.nrw.de/geobasis/wms_nw_dtk50',
            params: { LAYERS: 'nw_dtk50_col' },
            attributions: '© BKG'
          })
        }),
        this.markerLayer
      );
      this.map.setLayers(layers);
    } else { // Mapbox-Style
      this.map.setLayers([]);
      applyMapboxStyle(this.map, 'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_top.json')
        .then(() => {
          this.map.addLayer(this.markerLayer); // Marker-Layer bleibt
          // userLayer wird NICHT hinzugefügt
        });
    }
  }
}
