import { SignupService } from './../services/signup.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('soundModal')
  soundModal: ElementRef;
  @ViewChild('close')
  close: ElementRef;
user;
date;
showModel:boolean = false;
sound;
showMute:boolean;
modal:boolean;
  constructor(private ss:SignupService, private router:Router,private elementRef:ElementRef) { }

  ngOnInit(): void {
     this.user = JSON.parse(localStorage.getItem('user'));
     if(this.user === null){
      this.router.navigate(['']);
     }
     this.sound = new Audio();
     this.sound.src = "assets/audio/sound.mpeg";
     this.sound.loop = true;
     this.sound.load();
     this.modal = true;
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sound.pause();
  
  }
  play(){
    this.showMute = true;
    this.sound.play();
    this.modal = false;
  }
  stop(){
    this.showMute = false;
    this.sound.pause();
    this.modal = false;
  }
  ngAfterViewInit() {
   
    this.modal = true;
//  this.elementRef.nativeElement.ownerDocument
//         .body.style.overflow = 'auto';
}
  photo(){
    var mac = /(Mac)/i.test(navigator.platform);

if (mac) {
  window.open('assets/photoboothMac/index.html','_self');
}else{
  window.open('assets/Photobooth/index.html','_self');
}
    
   }

   logout(){
   
    
    this.ss.logout();
    }
 
}
