import { SignupService } from './../services/signup.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
class signup {
  constructor(
    public email: string = null,
    public name:string =null,
    public phoneNumber: number = null,
    public age:number = null,
    public college:string =null,
    public yes:boolean = null,
    public no:boolean = null,
    public question:string =null,
  ) {
  }
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user;
  Errormsg:boolean = false;
  ErrorText;
  showSignup:boolean = true;
  @ViewChild('signupForm') form: any;
  model: signup = new signup();
  constructor(private router:Router, private ss:SignupService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    if(this.user != null){
      this.router.navigate(['/video']);
    }
   
  }
onSubmit(){
 
  switch (null) {
    case this.form.value.name:
      this.showMsg('Name field is required*');
      break;
    case this.form.value.email:
      this.showMsg('Email ID field is required*');
      break;
    case this.form.value.phoneNumber:
      this.showMsg('Phone Number field is required*');
      break;
    case this.form.value.age:
      this.showMsg('Age field is required*');
      break;
    case this.form.value.college:
      this.showMsg('College field is required*');
      break;
    default:
      if(this.form.value.email){
   
        var pattern = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
        var result=pattern.test(this.form.value.email);
        if(result){
          if(this.form.value.phoneNumber.toString().length === 10){
            if(this.form.value.age <= 100){
              this.Errormsg = true;
               this.ErrorText = "Loading...";
              this.ss.signup(this.form.value).then((res)=>{
                // this.showMsg('Signup Done');
                this.ss.sendEmail(this.form.value.email);
                this.showSignup = false;
                this.Errormsg = false;
              }).catch((err)=>{
                this.Errormsg = false;
                this.showMsg(err);
              })
            }else{
              this.showMsg('Enter Valid Age');
            }
          }else{
            this.showMsg('Enter Valid Phone Number(10 digit)');
          }
        }else{
          this.showMsg('Enter Valid Email ID');
        }
      }
  }
}

chkBox(){
  if(this.model.yes){
    this.model.no = false;
  }
  
}
chkBox1(){
 
  if(this.model.no){
    this.model.yes = false;
  }
}
showMsg(msg){
        this.Errormsg = true;
        this.ErrorText = msg;
        setTimeout(() => {
          this.Errormsg= false;
        }, 1500);
}
}
