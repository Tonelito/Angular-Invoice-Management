import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { CookieUtil } from '../../utilities/storage-utility';
import { FindRoleUtil } from '../../utilities/find-role.utility';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public sub: string = '';

  constructor(
    private readonly translate: TranslateService,
    private readonly securityService: AuthService
  ) {
    this.translate.use('es');
  }

  ngOnInit() {
    this.sub = CookieUtil.getValue('sub') ?? '';
  }

  hasRole(role: string): boolean {
    return FindRoleUtil.validAuthority(role);
  }

  spanish() {
    this.translate.use('es');
  }

  english() {
    this.translate.use('en');
  }

  logOut() {
    this.securityService.logout();
  }
}
