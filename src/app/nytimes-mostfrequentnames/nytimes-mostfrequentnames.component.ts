import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import {NameOccurences} from './name-occurences';
import {DateToNameOccurences} from './date-to-name-occurences';

@Component({
  selector: 'app-nytimes-mostfrequentnames',
  templateUrl: './nytimes-mostfrequentnames.component.html',
  styleUrls: ['./nytimes-mostfrequentnames.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NytimesMostfrequentnamesComponent implements OnInit {

  constructor(public dialog: MatDialog, private httpService: HttpClient) {}

  title: string = "A Century of New York Times Articles";
  years: number[] = [1900];
  months: number[] = [1,2,3,4,5,6,7,8,9,10,11,12];
  arrDateToNameOccurences: DateToNameOccurences[] = [];
  mapDateToNameOccurences: Map<string, NameOccurences[]> = new Map();

  openDialog(year: number, month: number) {
    var dialogRef = this.dialog.open(DialogContentExampleDialog);
    dialogRef.componentInstance.arrNameOccurences = this.getNameOccurencesForYearAndMonth(year, month);
    dialogRef.componentInstance.yearAndMonth = year + "-" + month;
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getYearAndMonthString(year:number, month:number) {
    return String(year) + "-" + String(month);
  }

  getNameOccurencesForYearAndMonth(year:number, month:number) {
    let yearAndMonth:string = this.getYearAndMonthString(year, month);
    if(this.mapDateToNameOccurences.has(yearAndMonth)) {
      return this.mapDateToNameOccurences.get(yearAndMonth);
    } else {
      return [undefined];
    }
  }

  getMostFrequentNameOccurenceForYearAndMonth(year:number, month:number) {
    return this.getNameOccurencesForYearAndMonth(year, month)[0];
  }

  getAllNameOccurencesAbovePercentageThreshold(threshold:number) {
    let arrNameOccurences: DateToNameOccurences[] = [];
    for(let dateToNameOccurences of this.arrDateToNameOccurences) {
      let filteredDateToNameOccurences: DateToNameOccurences = new DateToNameOccurences();
      let filteredNameOccurences: NameOccurences[] = [];
      filteredDateToNameOccurences.yearAndMonth = dateToNameOccurences.yearAndMonth;
      for(let nameOccurences of dateToNameOccurences.nameOccurences) {
        if(nameOccurences.percentageOfTotal > threshold) {
          filteredNameOccurences.push(nameOccurences);
        }
      }
      filteredDateToNameOccurences.nameOccurences = filteredNameOccurences;
      if(filteredNameOccurences.length > 0) {
        arrNameOccurences.push(filteredDateToNameOccurences);
      }
    }
    return arrNameOccurences;
  }

  getMostMentionedName() {
    let mapOfNameToOccurrences = new Map();
    for(let dateToNameOccurrences of this.arrDateToNameOccurences) {
      for(let nameOccurences of dateToNameOccurrences.nameOccurences) {
        let name: string = nameOccurences.normalizedName;
        if(mapOfNameToOccurrences.get(name)) {
          mapOfNameToOccurrences.set(name, mapOfNameToOccurrences.get(name) + nameOccurences.occurrences);
        } else {
          if(nameOccurences.occurrences) {
            mapOfNameToOccurrences.set(name, nameOccurences.occurrences);
          }
        }
      }
    }
    let sortedEntries = Array.from(mapOfNameToOccurrences.entries()).sort((e1,e2) => e1[1] < e2[1] ? 1 : -1);
    if(sortedEntries && sortedEntries[0]) {
      return sortedEntries[0][0];
    } else {
      return "";
    }
  }

  getNumberOfOccurencesForName(name:string) {
    let count:number = 0;
    for(let dateToNameOccurences of this.arrDateToNameOccurences) {
      for(let nameOccurences of dateToNameOccurences.nameOccurences) {
        if(nameOccurences.normalizedName == name) {
          count += nameOccurences.occurrences;
        }
      }
    }
    return count;
  }

  populateData() {
    for(let dateToNameOccurences of this.arrDateToNameOccurences) {
      let yearAndMonth:string = dateToNameOccurences.yearAndMonth;
      let year:number = +(yearAndMonth.split("-")[0]);
      if(!this.years.includes(year)) {
        this.years.push(year);
      }
      if(dateToNameOccurences.nameOccurences) {
        this.mapDateToNameOccurences.set(yearAndMonth, dateToNameOccurences.nameOccurences);
      }
    }
  }

  ngOnInit() {
    this.httpService.get('./assets/nytimes-mostfrequentnames/data.json').subscribe(
      data => {
        this.arrDateToNameOccurences = data as DateToNameOccurences[];	 // FILL THE ARRAY WITH DATA.
        console.log(this.arrDateToNameOccurences[1]);
        this.populateData();
      },
      (err: HttpErrorResponse) => {
        console.log (err.message);
      }
    );
  }

}

@Component({
  selector: 'namecard-dialog-content',
  templateUrl: 'namecard-dialog-content.html',
  styleUrls: ['./namecard-dialog-content.css'],
})
export class DialogContentExampleDialog implements OnInit {
  arrNameOccurences: NameOccurences[];
  yearAndMonth: string;

  constructor(public dialogRef: MatDialogRef<DialogContentExampleDialog>) {}
   
  ngOnInit() {
  }
}