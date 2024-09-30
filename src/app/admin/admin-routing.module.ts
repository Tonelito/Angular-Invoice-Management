import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditComponent } from './components/audit/audit.component';
import { ProfilesComponent } from './components/profiles/profiles.component';

const routes: Routes = [
  {
    path: 'audit',
    component: AuditComponent
  },
  {
    path: 'profiles',
    component: ProfilesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
