import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {NameOccurences} from './name-occurences';

@Component({
  selector: 'namecard',
  templateUrl: './namecard.component.html',
  styleUrls: ['./namecard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NamecardComponent implements OnInit {
  @Input() nameOccurences: NameOccurences;
 
  getName() {
    if(this.nameOccurences && this.nameOccurences.normalizedName) {
        return this.nameOccurences.normalizedName;
    } else {
        return "No data";
    }
  }

  getPortraitImage() {
      if(this.nameOccurences && this.nameOccurences.imageUrl) {
        return this.nameOccurences.imageUrl;
      } else {
        return "../../assets/nytimes-mostfrequentnames/profile-placeholder.jpg";
      }
  }
  constructor() { }
 
  ngOnInit() {
  }
 
}