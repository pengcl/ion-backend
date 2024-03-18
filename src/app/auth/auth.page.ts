import {Component, NgZone} from '@angular/core';
import {FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';

import {StorageService} from '../@core/services/storage.service';
import {AuthService} from './auth.service';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatLabel, MatFormField} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [MatCardModule, MatCheckboxModule, MatLabel, MatFormField, FormsModule, ReactiveFormsModule]
})
export class AuthPage {
  form: FormGroup = new FormGroup({
    identifier: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false, []),
  });

  constructor(private router: Router,
              private zone: NgZone,
              private storageSvc: StorageService,
              private authSvc: AuthService) {
  }

  ionViewDidEnter(): void {
    this.form.reset();
    let loginForm: any = this.storageSvc.get('loginForm', true);
    if (loginForm) {
      loginForm = JSON.parse(loginForm);
      this.form.setValue(loginForm);
    }
  }

  login(): any {
    if (this.form.invalid) {
      return false;
    }
    this.authSvc.login(this.form.value).subscribe(res => {
      // 设置用户Token信息
      console.log(this.form.get('remember')?.value);
      if (this.form.get('remember')?.value) {
        this.storageSvc.set('loginForm', JSON.stringify(this.form.value));
      } else {
        this.storageSvc.remove('loginForm');
      }
      const loginStatus = {token: res.data.token, user: {name: res.data.userName, type: res.data.userType}};
      this.authSvc.updateLoginStatus(loginStatus);
      // this.router.navigate(['/admin/dashboard']).then();
      this.zone.run(() => {
        this.router.navigate(['/admin/dashboard']).then();
      });
    });

  }

}
