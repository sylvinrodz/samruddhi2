import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderspeakComponent } from './leaderspeak.component';

describe('LeaderspeakComponent', () => {
  let component: LeaderspeakComponent;
  let fixture: ComponentFixture<LeaderspeakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaderspeakComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderspeakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
