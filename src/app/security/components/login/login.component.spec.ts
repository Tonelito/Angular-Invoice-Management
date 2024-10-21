import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import {
  TranslateService,
  TranslateModule,
  TranslateFakeLoader,
  TranslateLoader
} from '@ngx-translate/core';
import { AuthService } from '../../../shared/services/auth.service';
import { BlockUIModule } from 'ng-block-ui';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error-state-matcher.utility';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;
  let translateService: TranslateService;

  const mockLoginData = {
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const notificationsServiceSpy = jasmine.createSpyObj(
      'NotificationsService',
      ['success', 'error']
    );

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        BlockUIModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationsService = TestBed.inject(
      NotificationsService
    ) as jasmine.SpyObj<NotificationsService>;
    translateService = TestBed.inject(TranslateService);

    spyOn(translateService, 'get').and.returnValue(of('translated text'));
    spyOn(translateService, 'instant').and.returnValue('translated text');

    translateService.setDefaultLang('en');
    translateService.use('en');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // Spy on the blockUI instance directly from the component
    spyOn(component.blockUI, 'start');
    spyOn(component.blockUI, 'stop');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.hide).toBeTruthy();
    expect(component.matcher instanceof MyErrorStateMatcher).toBeTruthy();
    expect(component.options).toBeDefined();
    expect(component.options.timeOut).toBe(3000);
    expect(component.options.showProgressBar).toBeFalse();
    expect(component.options.pauseOnHover).toBeTrue();
    expect(component.options.clickToClose).toBeTrue();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.loginForm;
      expect(form.valid).toBeFalsy();

      const emailControl = form.get('email');
      const passwordControl = form.get('password');

      expect(emailControl?.errors?.['required']).toBeTruthy();
      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.loginForm.get('email');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.errors?.['email']).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.errors?.['email']).toBeFalsy();
    });

    it('should be valid with correct data', () => {
      component.loginForm.patchValue(mockLoginData);
      expect(component.loginForm.valid).toBeTruthy();
    });
  });

  describe('onSubmit', () => {
    it('should not call login service if form is invalid', () => {
      component.onSubmit();
      expect(authService.login).not.toHaveBeenCalled();
      expect(notificationsService.error).toHaveBeenCalled();
      expect(translateService.instant).toHaveBeenCalledWith(
        'LOGIN.NOTIFICATIONS.INVALID_FORM'
      );
      expect(translateService.instant).toHaveBeenCalledWith(
        'LOGIN.NOTIFICATIONS.INVALID_FORM_DESC'
      );
    });

    it('should call login service with correct data when form is valid', fakeAsync(() => {
      authService.login.and.returnValue(of({}));
      component.loginForm.patchValue(mockLoginData);

      component.onSubmit();
      tick();

      expect(component.blockUI.start).toHaveBeenCalledWith('translated text');
      expect(authService.login).toHaveBeenCalledWith(mockLoginData);
      expect(notificationsService.success).toHaveBeenCalledWith(
        'translated text',
        'translated text'
      );
      expect(component.blockUI.stop).toHaveBeenCalled();
    }));

    it('should handle login error correctly', fakeAsync(() => {
      const errorMessage = 'Login failed';
      authService.login.and.returnValue(
        throwError(() => new Error(errorMessage))
      );
      component.loginForm.patchValue(mockLoginData);

      spyOn(console, 'error');

      component.onSubmit();
      tick();

      expect(component.blockUI.start).toHaveBeenCalled();
      expect(notificationsService.error).toHaveBeenCalledWith(
        'translated text',
        'translated text'
      );
      expect(console.error).toHaveBeenCalledWith(new Error(errorMessage));
      expect(component.blockUI.stop).toHaveBeenCalled();
    }));
  });

  describe('Password visibility toggle', () => {
    it('should toggle password visibility', () => {
      expect(component.hide).toBeTruthy();
      component.hide = !component.hide;
      expect(component.hide).toBeFalsy();
      component.hide = !component.hide;
      expect(component.hide).toBeTruthy();
    });
  });

  describe('Translations', () => {
    it('should initialize with translations', () => {
      expect(translateService.get).toBeDefined();
      expect(translateService.instant).toBeDefined();
    });

    it('should use translation service for form labels and messages', () => {
      component.onSubmit();
      expect(translateService.instant).toHaveBeenCalledWith(
        'LOGIN.NOTIFICATIONS.INVALID_FORM'
      );
      expect(translateService.instant).toHaveBeenCalledWith(
        'LOGIN.NOTIFICATIONS.INVALID_FORM_DESC'
      );
    });
  });

  describe('BlockUI', () => {
    it('should handle BlockUI correctly during login process', fakeAsync(() => {
      authService.login.and.returnValue(of({}));
      component.loginForm.patchValue(mockLoginData);

      component.onSubmit();
      tick();

      expect(component.blockUI.start).toHaveBeenCalledWith('translated text');
      expect(component.blockUI.stop).toHaveBeenCalled();
    }));
  });

  describe('Error State Matcher', () => {
    it('should have a valid error state matcher instance', () => {
      expect(component.matcher).toBeTruthy();
      expect(component.matcher instanceof MyErrorStateMatcher).toBeTruthy();
    });
  });
});
