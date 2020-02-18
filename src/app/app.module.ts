import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormUploadComponent } from './form-upload/form-upload.component';
import { UploadFileService } from './upload-file.service';
import { ShapeService } from './shape.service';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { WhiteboardPageComponent } from './whiteboard-page/whiteboard-page.component';
import { FormsModule } from '@angular/forms';
import {SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, AuthService, LoginOpt} from 'angularx-social-login';
import { LogInComponent } from './log-in/log-in.component';
import { AuthGuardService } from './auth-guard.service';
import { ConfirmComponent } from './confirm/confirm.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { SignUpComponent } from './sign-up/sign-up.component';



const fbLoginOptions: LoginOpt = {
  scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
  return_scopes: true,
  enable_profile_selector: true
};

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
};

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("540238227415-umb710t16uh74ehtdp6pm6rhoif1iss3.apps.googleusercontent.com")
  },
  {
    id:FacebookLoginProvider.PROVIDER_ID,
    provider:new FacebookLoginProvider("2650979154949369")
  }
]);

export function provideConfig() {
  return config;
}
 

@NgModule({
  declarations: [
    AppComponent,

    FormUploadComponent,

    WhiteboardPageComponent,

    LogInComponent,

    ConfirmComponent,

    ForgotPassComponent,

    ResetPassComponent,

    SignUpComponent,


  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    FormsModule,
    ColorPickerModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    UploadFileService, ShapeService, AuthService, AuthGuardService],

  bootstrap: [AppComponent]
})
export class AppModule { }
