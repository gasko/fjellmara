import { Component, OnInit, AfterViewInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  chartLabels: any;
  v_totalrunners : number;
  v_fastest_mtime : string;
  v_fastest_mtime_name : string;
  v_fastest_mtime_year : number;
  v_fastest_ftime : string;
  v_fastest_ftime_name : string;
  v_fastest_ftime_year : number;
  v_slowest_time : string;
  v_avg_time : string;

  alias: string;
  c_alias: string;

  passings: Passing[];
  labelminutes:number = 5;
  dataPassings : number[] = [];
  dataNormal: number[] = [];
  ret:number[] = [];

  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  chartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          //id: 'y-axis-1',
          display: true,
          position: 'left',
          scaleLabel:
          {
            display: true,
            labelString: 'Löpare per minut',
            fontColor: "#555555"
          },
          gridLines: {
            display: true,
            color: "#555555"
          }
        }
      ],
      xAxes: [
        {
          //id: 'x-axis-1',
          display: true,
          position: 'left',
          scaleLabel:
          {
            display: true,
            labelString: 'Tid sen start',
            fontColor: "#555555"
          },
          gridLines: {
            display: true,
            color: "#555555"
          }
        }
      ]
    }
  };



  constructor(
    private passingService: PassingService,
    private route: ActivatedRoute
  ) {
    route.params.subscribe(val => {
      let race = this.getAlias();
      let checkpoint = this.getCAlias();

      this.chartLabels = this.createLabels('00:30','05:30');
      this.dataPassings = [];
      this.dataNormal = [];
      this.chartData = [
        { data: this.dataPassings, label: 'Passeringar'},
        { data: this.dataNormal, label: 'Normalfördelning'},
      ];
      console.log(race);
      this.fetchStats(race,checkpoint);
  });
  }

  onChartClick(event) {
    console.log(event);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // this.chartData = [
    //   { data: this.dataNormal, label: 'test'},
    //   { data: this.dataPassings, label: 'test1'},
    // ];
  }

  getAlias(): string {
    // console.log(this.alias);
    // console.log(this.route.snapshot.paramMap.keys);
    // console.log(+this.route.snapshot.paramMap.get Keys);
    return this.route.snapshot.paramMap.get('alias');
  }
  getCAlias(): string {
    // console.log(this.c_alias);
    // console.log(this.route.snapshot.paramMap.keys);
    // console.log(+this.route.snapshot.paramMap.get Keys);
    let temp:string = this.route.snapshot.paramMap.get('c_alias');

    if (temp){
      return temp;
    } else {
      return "finnish";
    }

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
    // console.log("mean[" + mean + "] stddev[" + stddev + "]");

    let ret= [];
    let x;
    const mean60 = mean/60;
    const stddev60 = stddev/60;
    // console.log("mean60[" + mean60 + "] stddev60[" + stddev60 + "]");
    for (const labeltime of mlabel) {
      // console.log(labeltime);
      let sec:number = labeltime.split(":",2);
      // console.log(sec);
      sec = +sec[0]*60 + +sec[1];
      x = this.pdf(sec, mean60, stddev60);
      // x = x * number_of_runners;
      // if (x < 0.1){
      //   x = 0;
      // }
      ret.push(x);
    }
    return ret;
  }

  getLabelSerie(mlabel:string[], passings:Passing[]): number[] {
    //console.log('getLabelSerie' + (Passing)passings[1]);
    let checkpassings:Passing[] = passings;
    let ret= [];
    while(checkpassings[0].time < mlabel[0]){
      checkpassings.shift();
    }
    for (const labeltime of mlabel) {
      if( 0 < checkpassings.length && labeltime == checkpassings[0].time){
        ret.push(checkpassings[0].count)
        checkpassings.shift();
      }
      else if(0 < checkpassings.length && labeltime > checkpassings[0].time){
        //do nothing
      }
      else {
        ret.push(0);
      }
    }
    // console.log("ret[" + ret + "]");
    return ret;
  }

  fetchStats(race:string, checkpoint:string) {
    this.passingService.getStats(race,checkpoint).subscribe(stats =>
      {
        this.v_totalrunners = stats['tot_runners'];
        this.v_fastest_mtime = stats['fastest_m_time'];
        this.v_fastest_mtime_name = stats['fastest_m_time_name'];
        this.v_fastest_mtime_year = stats['fastest_m_time_year'];
        this.v_fastest_ftime = stats['fastest_f_time'];
        this.v_fastest_ftime_name = stats['fastest_f_time_name'];
        this.v_fastest_ftime_year = stats['fastest_f_time_year'];
        this.v_slowest_time = stats['slowest_time'];
        this.v_avg_time = stats['avgtime'];
        let nr_of_races = stats['numberofraces'];
        console.log(stats);

        let fastest_time_sec:number;

        if (stats['fastest_m_time_sec'] <= stats['fastest_m_time_sec']){
          fastest_time_sec = stats['fastest_m_time_sec'];
        }
        else {
          fastest_time_sec = stats['fastest_f_time_sec'];
        }

        // console.log("fastest time sec: " + fastest_time_sec);
        // console.log(fastest_time_sec-600);
        // console.log((fastest_time_sec-600)/900);
        //console.log(Math.trunc(fastest_time_sec-600)/900));

        // 600 = 10min tidigare, 900 = 15*60 dela upp i 15min delar
        let tempx : number;
        tempx = Math.trunc((fastest_time_sec-600)/900);

        // starta på kvarten innan första tid
        let labelstart = this.minutesToHourMinute(tempx*15);
        // sluta på kvarten efter sista tid
        tempx = Math.trunc(stats['slowest_time_sec']/900)+1;
        let labelend = this.minutesToHourMinute(tempx*15);

        this.chartLabels = [];
        this.chartLabels = this.createLabels(labelstart,labelend);
        let tempNormal:number[] = this.createPdfSerie(this.chartLabels, stats['avgtime_sec'], stats['stddev_sec']);
        for (const x of tempNormal){
          this.dataNormal.push(x * this.v_totalrunners / nr_of_races);
        }

        let pass:Passing[] = stats['passings'];
        // console.log(pass);
        // console.log("dataNormal" + this.dataNormal);
        // console.log("passings: " + stats['passings'])
        let tempPassings = this.getLabelSerie(this.chartLabels, pass);
        for (const x of tempPassings){
          this.dataPassings.push(x / this.labelminutes / nr_of_races);// == 0 ? x : x/5
        }
        // console.log("dataNormal" + this.dataPassings);
      });
  }

  // fetchPassings(race:string, checkpoint:string, year:number) {
  //   this.passingService.getPassings(race,checkpoint,year).subscribe(passings =>
  //     {
  //       let checkpassings = passings;
  //       this.ret= [];
  //       this.ret = this.getLabelSerie(this.label, passings);
  //     });
  // }



}
