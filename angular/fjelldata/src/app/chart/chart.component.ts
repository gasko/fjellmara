import { Component, OnInit, AfterViewInit} from '@angular/core';
import {  } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { Passing } from '../passing';
import { CheckpointStat } from '../checkpointStat';
import { PassingService } from '../passing.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit, AfterViewInit {
  canvas: any;
  ctx: any;
  passings: Passing[];
  const labelminutes:number = 5;
  dataPassings : number[] = [];
  dataNormal: number[] = [];
  ret:number[] = [];

  constructor(private passingService: PassingService) { }

  chartOptions = {
    responsive: true
  };


  onChartClick(event) {
    console.log(event);
  }

  ngOnInit() {
    this.chartLabels = this.createLabels('00:30','05:30');
    this.chartData = [
      { data: this.dataNormal, label: 'test'},
      { data: this.dataPassings, label: 'test1'},
    ];
    this.fetchStats("fjallmara","hallfjallet");
  }

  ngAfterViewInit() {
  }

  pdf(value:number, mean:number, standardDeviation:number ): number {
    const dividend = Math.pow(
      Math.E,
      -Math.pow(value - mean, 2) /
        (2 * Math.pow(standardDeviation, 2))
    );
    // console.log("dividend: "+ dividend);
    const divisor = standardDeviation * Math.sqrt(2 * Math.PI);
    // console.log("divisor: "+ divisor);
    return dividend / divisor;
  }

  getMinutes(time: string): number {
    let splitted : number = time.split(':');
    return +splitted[0] * 60 + +splitted[1];
  }

  minutesToHourMinute(minutes :number): string {
    let h:string = String(Math.floor(minutes / 60));
    let m:string = String(minutes % 60);
    h = +h < 10 ? '0' + h : h;
    m = +m < 10 ? '0' + m : m;
    return `${h}:${m}`;
  }

  createLabels(start:string, end:string): string[] {
    //console.log(start + " => " + end)
    let startMinutes:number = this.getMinutes(start);
    let endMinutes:number = this.getMinutes(end);
    let label = [];
    //console.log(startMinutes + " => " + endMinutes);
    while (startMinutes <= endMinutes) {
      label.push(this.minutesToHourMinute(startMinutes));
      startMinutes = startMinutes + 5;
    }
    //console.log(label);
    return label;
  }

  createPdfSerie(mlabel:string[], mean:number, stddev:number): number[] {
    console.log("mean[" + mean + "] stddev[" + stddev + "]");

    const number_of_runners = 1000;

    let ret= [];
    let x;
    const mean60 = mean/60;
    const stddev60 = stddev/60;
    for (const labeltime of mlabel) {
      let sec:number = +labeltime.split(":",2);
      sec = +sec[0]*60 + +sec[1];
      x = this.pdf(sec, mean60, stddev60);
      x = +x * number_of_runners;
      if (+x < 0.1){
        x = 0;
      }
      ret.push(x);
    }
    return ret;
  }

  getLabelSerie(mlabel:string[], passings:Passing[]): number[] {
    //console.log('getLabelSerie' + (Passing)passings[1]);
    let checkpassings:Passing[] = passings;
    let ret= [];
    while((Passing)checkpassings[0].time < mlabel[0]){
      checkpassings.shift();
    }
    for (const labeltime of mlabel) {
      if( 0 < checkpassings.length && labeltime == (Passing)checkpassings[0].time){
        ret.push(checkpassings[0].count)
        checkpassings.shift();
      }
      else if(0 < checkpassings.length && labeltime > (Passing)checkpassings[0].time){
        //do nothing
      }
      else {
        ret.push(0);
      }
    }
    return ret;
  }

  fetchStats(race:string, checkpoint:string) {
    this.passingService.getStats(race,checkpoint).subscribe(stats =>
      {
        this.v_totalrunners = stats['tot_runners'];
        this.v_fastest_time = stats['fastest_time'];
        this.v_slowest_time = stats['slowest_time'];
        this.v_avg_time = stats['avgtime'];
        console.log(stats);

        let temp:number;
        temp = Math.trunc(stats['fastest_time_sec']/1800);
        let labelstart = this.minutesToHourMinute(temp*30);

        temp = Math.trunc(stats['slowest_time_sec']/1800)+1;
        let labelend = this.minutesToHourMinute(temp*30);

        this.chartLabels = [];
        this.chartLabels = this.createLabels(labelstart,labelend);
        this.dataNormal = this.createPdfSerie(this.chartLabels, stats['avgtime_sec'], stats['stddev_sec']);
        console.log("dataNormal" + this.dataNormal);
        console.log("passings: " + stats['passings'])
        //this.data = this.getLabelSerie(this.chartLabels, stats['passings']);
      });
  }

  fetchPassings(race:string, checkpoint:string, year:number) {
    this.passingService.getPassings(race,checkpoint,year).subscribe(passings =>
      {
        let checkpassings = passings;
        this.ret= [];
        this.ret = this.getLabelSerie(this.label, passings);
      });
  }



}
