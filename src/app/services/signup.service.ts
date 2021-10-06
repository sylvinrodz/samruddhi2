import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private firestore:AngularFirestore,private http: HttpClient) { }

  signup(data){
    var promise =  new Promise((resolve, reject) => {
     
      this.firestore.collection("signup").doc(data.email).get().subscribe(res=>{
        if(!res.exists){
          data["signupAt"] = new Date();
          this.firestore.collection("signup").doc(data.email).set(data).then((res1)=>{
            resolve("Signup Done")
          }).catch(()=>{
            reject("Something went wrong , Please check your internet connection");
          })
        }else{
          reject("This Email ID already exist.Please Login");
        }
      });
    })
   return promise;
  }
  sendEmail(email){
   this.http.post<any>("https://www.skilliza.com/php/sendmail/smtp/",JSON.stringify({  
      to: email
  })).subscribe((data)=>{console.log(data)},
  (err)=>{console.log(err);}
  );
  }
  addData(data){
   
    return this.firestore.collection('users').doc(data['id']).set(data);
  
  }
  logout(){
    var userDetails = JSON.parse(localStorage.getItem('user'));
    console.log(userDetails);
    this.firestore.collection('users').doc(userDetails.id).update({
      isLogin:false,
      logoutAt: new Date()
    }).then(()=>{
      this.decreaseCount().then(()=>{
        localStorage.clear();
        location.reload();
      }).catch(err => alert(err));
     
    }).catch(err => alert(err));
  }
  increaseCount(){
    return this.firestore.collection('count').doc('count').update({
      total:firebase.default.firestore.FieldValue.increment(1)
    });
  }
  decreaseCount(){
    return this.firestore.collection('count').doc('count').update({
      total:firebase.default.firestore.FieldValue.increment(-1)
    });
  }
}
