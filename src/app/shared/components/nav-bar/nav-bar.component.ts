import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  constructor(
    private readonly translate: TranslateService,
    private readonly securityService: AuthService
  ) {
    this.translate.use('es');
  }

  logOut() {
    this.securityService.logout();
  }
}
