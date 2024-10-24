import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieUtil } from './shared/utilities/storage-utility';

// Mock TranslateService
class TranslateServiceMock {
  use(lang: string) {}
}

describe('AppComponent', () => {
  let authServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: jasmine.createSpy().and.returnValue(true),
      checkSessionExpiration: jasmine.createSpy()
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
