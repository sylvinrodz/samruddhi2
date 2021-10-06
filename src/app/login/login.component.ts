import { SignupService } from './../services/signup.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, ViewChild } from '@angular/core';
class login {
  constructor(
    public name: string = "",
    public email: string = ""
  ) {
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user;
  Errormsg:boolean = false;
  ErrorText;
  sound;
  showAudioModal:boolean;
  showCountDown:boolean= true;
  model: login = new login();
  @ViewChild('f') form: any;
  formSubmit:boolean = false;
  showLoginButton:boolean = true;
  constructor(private ss: SignupService,private router:Router,private firestore:AngularFirestore) {
  
  }

  ngOnInit(): void {
  

    this.user = JSON.parse(localStorage.getItem("user"));
    if(this.user != null){
      this.router.navigate(['/video']);
    }else{
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
  onSubmit(){
    
    this.formSubmit = true;
 var email = this.form.value.email.toString().toLowerCase().trim();
 var name = this.form.value.name.toString().toLowerCase().trim();
 this.form.value['email'] = email;
 this.form.value['name'] = name;


      if(name){
   
      if(email){
        var pattern = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
        var result=pattern.test(email);
        if(result){
          this.Errormsg = true;
          this.ErrorText = "Loading";
         
        this.showLoginButton = false;

         var data = this.form.value;
        
          
         this.firestore.collection("users").doc(email).get().subscribe((res)=>{
           
           if(res.exists){
             if(!res.data()["isLogin"]){
              data.isLogin = true;
              data.loginAt = new Date();
                this.ss.addData(data).then((res)=>{
                  this.showLoginButton = true;
                  localStorage.setItem('user', JSON.stringify(data));
                  this.router.navigate(['/video']);
                  this.ss.increaseCount();
                  setTimeout(() => {
                   this.Errormsg= false;
                 }, 1500);
                });
             }else{
              this.Errormsg = true;
              this.ErrorText = "This User already login*";
              setTimeout(() => {
                this.Errormsg= false;
              }, 1500);
              this.showLoginButton = true;
             }
          
           }else{
            this.Errormsg = true;
            this.ErrorText = "This User Does Not Exist*";
            setTimeout(() => {
              this.Errormsg= false;
            }, 1500);
            this.showLoginButton = true;
           }
         })
          
         
          }else{
            this.Errormsg = true;
            this.ErrorText = "Enter Valid Email ID*";
            setTimeout(() => {
              this.Errormsg= false;
            }, 1500);
            this.showLoginButton = true;
          }
      }else{
        this.Errormsg = true;
        this.ErrorText = "Email ID is required*";
        setTimeout(() => {
          this.Errormsg= false;
        }, 1500);
        this.showLoginButton = true;
      }   
    }else{
      this.Errormsg = true;
      this.ErrorText = "Name is required*";
      setTimeout(() => {
        this.Errormsg= false;
      }, 1500);
      this.showLoginButton = true;
    }
    

   
  }


}
