import { DomSanitizer } from '@angular/platform-browser';
import { SignupService } from './../services/signup.service';
import { ScrollToBottomDirective } from './../scroll-to-bottom.directive';
import { Router } from '@angular/router';
import { AngularFirestore , AngularFirestoreCollection } from '@angular/fire/firestore';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
declare var $: any;
import * as firebase from 'firebase/app';
export interface Likes { total: any; }
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit ,AfterViewInit {
  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective;
  clap;hoot;
  commentModal:boolean = false;
  question:String;
  showMsg:boolean = false;
  msg;
  user;
  name;
  VideoLink;
  showChat:boolean = false;
  showCountDown:boolean = true;
  Days;Hours;Minutes;Seconds;
  showPhoto:boolean = false;
  chats;
  
  showName:boolean = true;
  private likesCollection: AngularFirestoreCollection<Likes>;
  private thumbsCollection: AngularFirestoreCollection<Likes>;
  showEmojiPicker:boolean = false;
  constructor(private sanitize:DomSanitizer, private firestore:AngularFirestore,private ss:SignupService, private router:Router,private elementRef: ElementRef) { 
    this.firestore.collection("showCountDown").doc("showCountDown").valueChanges().subscribe((res)=>{
      console.log(res['value']);
      this.showCountDown = res['value'];
    })
  }
  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
        .body.style.backgroundColor = '#000000';
}

ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  this.elementRef.nativeElement.ownerDocument
  .body.style.backgroundColor = '#ffffff';
}
sendChat(){
  if(!this.msg)
    return;
  this.firestore.collection("chats").add({
    msg:this.msg,
    user:this.user,
    date:new Date()
  }).then((res)=>{
    this.msg = '';
  })
  this.msg = '';
}
  ngOnInit(): void {
    this.timer();
    this.firestore.collection("link").doc("link").valueChanges().subscribe((res)=>{
      this.VideoLink = this.sanitize.bypassSecurityTrustResourceUrl(res['link']);
 
    })
    this.user = JSON.parse(localStorage.getItem("user"));
    if(this.user != null){
      this.router.navigate(['/video']);
    }else{
      this.router.navigate(['/login']);
    }
    // this.name = this.user.name;
    // this.firestore.collection("chats",ref=>ref.orderBy('date').limitToLast(20)).valueChanges().subscribe((res)=>{
    //   this.chats = res;
      
    // })
   

    this.clap = new Audio();
    this.clap.src = "assets/audio/Clap.mp3";
    this.clap.load();
    this.hoot = new Audio();
    this.hoot.src = "assets/audio/Hoot.mp3";
    this.hoot.load();
    this.thumbsCollection = this.firestore.collection<Likes>('thumbs');
    this.likesCollection = this.firestore.collection<Likes>('likes');
     this.multiple();
     this.multiple1();
  //   this.likesCollection.doc("count").valueChanges().subscribe((res)=>{
     
     
  //        this.multiple();
      
  //   })
  //   this.thumbsCollection.doc("count").valueChanges().subscribe((res)=>{
     
     
  //      this.multiple1();
    
  // })
  }
  timer(){
    var countDownDate = new Date("Oct 11, 2021 15:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(()=> {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  if(hours + (days*24) < 10){
    var totalHours = hours + (days*24)
    this.Hours = "0"+ totalHours;
  }else{
    this.Hours = hours + (days*24);
  }
  if(minutes < 10){
    this.Minutes = "0"+ minutes;
  }else{
    this.Minutes = minutes;
  }
  if(seconds < 10){
    this.Seconds = "0"+ seconds;
  }else{
    this.Seconds = seconds;
  }
  

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    
  }
}, 1000);
  }
  addEmoji(event){
      if(this.msg)
    this.msg = this.msg + event.emoji.native;
    else
    this.msg = event.emoji.native;
    this.showEmojiPicker = false;
      }
      toggleEmojiPicker() {
        console.log(this.showEmojiPicker);
            this.showEmojiPicker = !this.showEmojiPicker;
      }

  showModal(a:boolean){
    this.commentModal = a;
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
// addItem(like: Likes,name) {
//   if(name === 'like'){
//     this.likesCollection.doc("count").update(like);
//   }else{
//     this.thumbsCollection.doc("count").update(like);
//   }
//   }
// addlike() {
//   var incremet =  firebase.default.firestore.FieldValue.increment(1);
//   this.addItem({total:incremet},"like")
//  this.play();
//  this.multiple();
// }
// addthumbs() {
//   var incremet =  firebase.default.firestore.FieldValue.increment(1);
//   this.addItem({total:incremet},'thumb')
//  this.play1();
//  this.multiple1();
// }
  askQuestion(question){
    var user = JSON.parse(localStorage.getItem('user'));
    var id = this.firestore.createId();
    this.firestore.collection("questions").doc(id).set({
      id:id,
      updatedAt:new Date(),
      question:question,
      name:user.name,
      contactNo:user.contactNo
    }).then(()=>{ 
      this.commentModal = false;
      this.question = '';
      this.msg = "Your message sent";
      this.showMsg = true;
      setTimeout(() => {
        this.msg = '';
        this.showMsg = false;
      }, 1500);
    })
  }
  play(){
 
    var b = Math.floor((Math.random() * 100) + 1);
    var d = ["flowOne", "flowTwo", "flowThree"];
    var c = (Math.random() * (1.6 - 1.2) + 1.2).toFixed(1);
    $('<div class="part-' + b + '" style="font-size:' + Math.floor(Math.random() * (50 - 22) + 22) + 'px;color: red; width: 30px;height: 30px;opacity: 1;position: absolute;bottom: 0;display: none;z-index: 11;"><i class="fa fa-heart"></i></div>').appendTo(".hearts").css({
        animation: "" + d[1] + " " + c + "s linear"
    });
    $(".part-" + b).show();
    setTimeout(() =>{
        $(".part-" + b).remove()
    }, Number(c) * 900)
    
  }
  play1(){
 
    var b = Math.floor((Math.random() * 100) + 1);
    var d = ["flowOne", "flowTwo", "flowThree"];
    var c = (Math.random() * (1.6 - 1.2) + 1.2).toFixed(1);
    $('<div class="part-' + b + '" style="font-size:' + Math.floor(Math.random() * (50 - 22) + 22) + 'px;color: #0C78B8; width: 30px;height: 30px;opacity: 1;position: absolute;bottom: 0;display: none;z-index: 11;"><i class="fa fa-thumbs-up"></i></div>').appendTo(".thumbs").css({
        animation: "" + d[1] + " " + c + "s linear"
    });
    $(".part-" + b).show();
    setTimeout(() =>{
        $(".part-" + b).remove()
    }, Number(c) * 900)
    
  }
  multiple(){
    
    
   var one =  setInterval(()=>{
          this.play()
        },1500);
   var two =  setInterval(()=>{
      this.play()
    },2000);
    setTimeout(() => {
      clearInterval(one);
      clearInterval(two);
    }, 3500);
  }
  multiple1(){
    
    
    var one =  setInterval(()=>{
           this.play1()
         },1500);
    var two =  setInterval(()=>{
       this.play1()
     },2000);
     setTimeout(() => {
       clearInterval(one);
       clearInterval(two);
     }, 3500);
   }
}
