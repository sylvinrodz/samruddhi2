import { SignupService } from './../services/signup.service';
import { Router } from '@angular/router';
import { Component, OnInit, ElementRef } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-leaderspeak',
  templateUrl: './leaderspeak.component.html',
  styleUrls: ['./leaderspeak.component.css']
})
export class LeaderspeakComponent implements OnInit {
name;link;user;
showVideoModel:boolean = false;
  constructor(private ss:SignupService, private elementRef: ElementRef,public sanitizer: DomSanitizer, private router:Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    if(this.user != null){
      this.router.navigate(['/leaderspeak']);
    }else{
      this.router.navigate(['/login']);
    }
  }
modalOpen(name,link){

  this.name = name;
  this.link = this.sanitizer.bypassSecurityTrustResourceUrl(link);
 this.elementRef.nativeElement.ownerDocument.body.style.overflow = "auto";
 this.showVideoModel = true;
}
close(){
  this.name = "";
  this.link = null;
}
home(){
  this.router.navigate(["/main"]);
}

logout(){
this.ss.logout();

}
}
