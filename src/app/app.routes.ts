import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { MapPage } from './pages/map-page/map-page';
import { Delete } from './pages/delete/delete';
import { Login } from './pages/login/login';
import { Profile } from './pages/profile/profile';
import { AdminPage } from './pages/admin-page/admin-page';
import { Registration } from './pages/registration/registration';
import { Products } from './pages/products/products';
import { Todo } from './pages/todo/todo';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "about", component: About },
    { path: "map", component: MapPage },
    { path: "delete", component: Delete },
    { path: "login", component: Login },
    { path: "profile", component: Profile },
    { path: "admin", component: AdminPage },
    {path: "registration", component: Registration},
    {path: "products", component: Products},
    {path: "todo", component: Todo}
];
