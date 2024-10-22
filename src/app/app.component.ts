import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieUtil } from './shared/utilities/storage-utility';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly translate: TranslateService
  ) {
    this.translate.use(CookieUtil.getValue('language') ?? 'en');
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.authService.checkSessionExpiration();
  }
}
