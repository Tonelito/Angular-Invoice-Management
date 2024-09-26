import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditComponent } from './components/audit/audit.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';

const routes: Routes = [
  {
    path: 'audit',
    component: AuditComponent
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
