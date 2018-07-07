import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-runner-find',
  templateUrl: './runner-find.component.html',
  styleUrls: ['./runner-find.component.css']
})

export class RunnerFindComponent implements OnInit {

  searchBib:number;
  searchSurname:string;
  searchFirstname:string;

  constructor() { }

  ngOnInit() {
  }

  fetchRunners(races:string[], years:number[], firstname:string, surname:string, bib:number): void {
    let allTemp:number;
    this.dataService.getRunner(race, year, bib).subscribe(runner => {
      let genderTemp:number;
      let classTemp:number;
      genderTemp = checkpoint.position.gender;
      classTemp = checkpoint.position.class;
      this.runner = runner;
      console.log(this.runner);
    });

  }

}
