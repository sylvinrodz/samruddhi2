import { SignupService } from './services/signup.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class AppComponent {
  title = 'microsite';
  isMobile;
  elem: any;
  user;
  showMsg:boolean = false;
  shoePage:boolean = true;
  fullTable:boolean = false;
  // @ViewChild('FullTableModal') fullTableModal: ModalDirective;

  showError:boolean=false;
  showFullscreen:boolean = false;
  isFullScreen: boolean;
  constructor(private ss:SignupService,private router:Router, @Inject(DOCUMENT) private document: any,private firestore:AngularFirestore){
    this.user =  JSON.parse(localStorage.getItem('user'));
    if(this.user != null){
      this.firestore.collection('users').doc(this.user.email).valueChanges().subscribe((res)=>{
        if(res){
          if(res['isLogin'] === false){
            localStorage.clear();
            location.reload();
          }
        }else{
          localStorage.clear();
          location.reload();
        }
        
      })
      // router.events.forEach((event) => {
      //   if(event instanceof NavigationStart) {
      //    if(event.url === "/main"){
      //      console.log('run')
      //    }else{
      //      console.log('not main');
           
      //    }
      //   }
        
      // });
    }
    this.elem = document.documentElement;
    
    this.isMobile = {
      Android: function() {
          return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
          return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
          return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
      },
      any: function() {
          return (this.isMobile.Android() || this.isMobile.BlackBerry() || this.isMobile.iOS() || this.isMobile.Opera() || this.isMobile.Windows());
      }
    };
    if(this.isMobile.Android() || this.isMobile.BlackBerry() || this.isMobile.iOS() || this.isMobile.Opera() || this.isMobile.Windows()){
   
      
      this.applyOrientation();
    }
      
  }
  onResize(event){
    if(this.isMobile.Android() || this.isMobile.BlackBerry() || this.isMobile.iOS() || this.isMobile.Opera() || this.isMobile.Windows()){
      this.chkScreenMode()
      this.applyOrientation();
    }

  }
  chkScreenMode(){
    if(document.fullscreenElement){
      //fullscreen
      this.isFullScreen = true;
    }else{
      //not in full screen
      this.isFullScreen = false;
    }
   
  }
  applyOrientation() {

    this.showFullscreen = true;
    if (window.innerHeight > window.innerWidth) {

      setTimeout(() => {
        // this.fullTableModal.show();
        this.fullTable = true;
        this.showMsg = true;
        this.shoePage = false;
        if(!this.isMobile.iOS()){
        //  this.fullscreen.hide();
        this.fullTable = false;
        this.shoePage = false;
        }
        // this.showError=true;
          });

    } else {
      
      setTimeout(() => {
        this.showMsg = false;
        this.shoePage = true;
        // this.fullTableModal.hide();
        this.fullTable = false;
        if(!this.isMobile.iOS()){
      if(!this.isFullScreen){
        // this.fullscreen.show();
        this.fullTable = true;
        this.shoePage = false;
      }
      
        }
        // this.showError=false;
          });
    //  this.router.navigate(['mobile']);
    // this.desktop = false;
    }
    

  }
  openFullscreen() {
    // this.fullscreen.hide();
    this.fullTable = false;
    this.shoePage = true;
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

}
