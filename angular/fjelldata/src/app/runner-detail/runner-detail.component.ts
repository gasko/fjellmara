import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';


@Component({
  selector: 'app-runner-detail',
  templateUrl: './runner-detail.component.html',
  styleUrls: ['./runner-detail.component.css']
})
export class RunnerDetailComponent implements OnInit {
  runner: Runner;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log("race: " + this.getUrlRace() + "   year: " + this.getUrlYear() + "   bib: " + this.getUrlBib());
    this.fetchRunner(this.getUrlRace(), this.getUrlYear(), this.getUrlBib());
  }

  getUrlRace(): string {

    console.log(this.route.snapshot.paramMap.keys);
    return this.route.snapshot.paramMap.get('race');
  }
  getUrlYear(): string {
    return this.route.snapshot.paramMap.get('year');
  }
  getUrlBib(): string {
    return this.route.snapshot.paramMap.get('bib');
  }


  fetchRunner(race:string, year:number, bib:number): void {
    let allTemp:number;
    this.dataService.getRunner(race, year, bib).subscribe(runner => {
      let genderTemp:number;
      let classTemp:number;
      // for (let checkpoint of runner.checkpoints) {
      //   console.log(allTemp);
      //   if (allTemp){
      //     checkpoint.position.allDiff = allTemp - checkpoint.position.all;
      //     console.log(checkpoint);
      //   }
      //   if (genderTemp){
      //     checkpoint.position.genderDiff = genderTemp - checkpoint.position.gender;
      //   }
      //   if (classTemp){
      //     checkpoint.position.classDiff = classTemp - checkpoint.position.class;
      //   }
      // }
      //   console.log(checkpoint.position.all);
      // allTemp = checkpoint.position.all;
      //   console.log(allTemp);
      // genderTemp = checkpoint.position.gender;
      // classTemp = checkpoint.position.class;
      this.runner = runner;
      console.log(this.runner);
    });

  }


}
