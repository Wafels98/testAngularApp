import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { MapPage } from './pages/map-page/map-page';
import { Delete } from './pages/delete/delete';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "about", component: About},
    {path: "map", component: MapPage},
    {path: "delete", component: Delete}
];
