import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditComponent } from './components/audit/audit.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { UsersComponent } from './components/users/users.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { authGuard } from '../shared/utilities/guards/auth.guard';

const routes: Routes = [
  {
    path: 'audit',
    component: AuditComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profiles',
    component: ProfilesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard]
  },
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
