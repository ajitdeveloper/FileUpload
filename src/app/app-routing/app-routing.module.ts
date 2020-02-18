import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WhiteboardPageComponent } from '../whiteboard-page/whiteboard-page.component';
import { FormUploadComponent } from '../form-upload/form-upload.component'
import {LogInComponent} from '../log-in/log-in.component'
import { AuthGuardService } from '../auth-guard.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ForgotPassComponent } from '../forgot-pass/forgot-pass.component';
import { ResetPassComponent } from '../reset-pass/reset-pass.component';
import { SignUpComponent } from '../sign-up/sign-up.component';

const routes: Routes = [
    {
        path:'',
        component: LogInComponent,
    },
    {
        path: 'signUp',
        component: SignUpComponent,
    },
    {
        path: 'dashboard',
        component: FormUploadComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'whiteboard',
        component: WhiteboardPageComponent,
        canActivate: [AuthGuardService]
    },

    { 
        path: 'confirm/:token', 
        component: ConfirmComponent 
    },
    {
        path: 'forget',
        component: ForgotPassComponent
    },
    {
        path: 'reset/:token',
        component: ResetPassComponent
    }

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }