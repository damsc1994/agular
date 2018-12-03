import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*Cargamos los componentes*/
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserComponent } from './components/users/user.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from './components/followed/followed.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegisterComponent},
  {path: 'mis-datos', component: UserEditComponent},
  {path: 'gente/:page', component: UserComponent},
  {path: 'gente', component: UserComponent},
  {path: 'timeline', component: TimelineComponent},
  {path: 'perfil/:id', component: ProfileComponent},
  {path: 'siguiendo/:id/:page', component: FollowingComponent},
  {path: 'seguidores/:id/:page', component: FollowedComponent},
  {path: '**', component: HomeComponent}

];

export const appRoutingProvaider: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});

