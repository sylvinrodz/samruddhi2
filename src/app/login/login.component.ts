import { SignupService } from './../services/signup.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, ViewChild } from '@angular/core';
class login {
  constructor(
    public title: string = 'Mr',
    public name: string = '',
    public email: string = '',
    public city: string = '',
    public state: string = '',
    public contactNo: number = null
  ) {}
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user;
  Errormsg: boolean = false;
  ErrorText;
  sound;
  showAudioModal: boolean;
  showCountDown: boolean = true;
  model: login = new login();
  @ViewChild('f') form: any;
  formSubmit: boolean = false;
  showLoginButton: boolean = true;
  constructor(
    private ss: SignupService,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user != null) {
      this.router.navigate(['/video']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onSubmit() {
    this.formSubmit = true;
    var email = this.form.value.email.toString().toLowerCase().trim();
    var name = this.form.value.name.toString().toLowerCase().trim();
    this.form.value['email'] = email;
    this.form.value['name'] = name;
    console.log(this.form.value);
    if (
      name &&
      this.form.value.city &&
      this.form.value.state
    ) {
      if(this.form.value.contactNo != null){
        const reg = new RegExp('^[0-9]+$');
        var result1 = reg.test(this.form.value.contactNo);
        if(this.form.value.contactNo.toString().length == 10 && result1){
        if (email) {
          var pattern = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$');
          var result = pattern.test(email);
          if (result) {
            this.login(this.form.value);
          } else {
            this.Errormsg = true;
            this.ErrorText = 'Enter Valid Email ID*';
            setTimeout(() => {
              this.Errormsg = false;
            }, 1500);
            this.showLoginButton = true;
          }
        } else {
          this.login(this.form.value);
        }
      }else{
        this.Errormsg = true;
        this.ErrorText = 'Enter Valid Contact Number*';
        setTimeout(() => {
          this.Errormsg = false;
        }, 1500);
        this.showLoginButton = true;
      }
     
    }else{
      this.Errormsg = true;
      this.ErrorText = 'Enter Valid Contact Number*';
      setTimeout(() => {
        this.Errormsg = false;
      }, 1500);
      this.showLoginButton = true;
    }
    } else {
      this.Errormsg = true;
      this.ErrorText = 'Mandatory fields required*';
      setTimeout(() => {
        this.Errormsg = false;
      }, 1500);
      this.showLoginButton = true;
    }
  }
  login(data) {
    this.Errormsg = true;
    this.ErrorText = 'Loading';

    this.showLoginButton = false;

    data.id = this.firestore.createId();
    data.isLogin = true;
    data.loginAt = new Date();
    this.ss.addData(data).then((res) => {
      this.showLoginButton = true;
      localStorage.setItem('user', JSON.stringify(data));
      this.router.navigate(['/video']);
      this.ss.increaseCount();
      setTimeout(() => {
        this.Errormsg = false;
      }, 1500);
    });
  }
}
