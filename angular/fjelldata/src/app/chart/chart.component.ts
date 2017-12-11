import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Passing } from '../passing';
import { PassingService } from '../passing.service';
import { ChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit, AfterViewInit {
  //passings: Passing[];
  label: Label[] = [];
  data17: Data[] = [];
  data16: Data[] = [];
  data15: Data[] = [];
  dataAll: Data[] = [];

  constructor(private passingService: PassingService) { }

  chartOptions = {
    responsive: true
  };


  onChartClick(event) {
    console.log(event);
  }

  ngOnInit() {
    this.createLabels();
    this.data17 = this.getPassings(2017);
    this.data16 = this.getPassings(2016);
    this.data15 = this.getPassings(2015);

    for (var _i = 0; _i < this.data17.length; _i++) {
        let avg = (this.data16[_i] + this.data15[_i] + this.data17[_i])/3;
        this.dataAll.push(avg)

    }
  console.log(this.dataAll);
    this.chartLabels = this.label;
    this.chartData = [
      { data: this.data17, label: '2017' }
      { data: this.data16, label: '2016' }
      { data: this.data15, label: '2015' }
      { data: this.dataAll, label: 'All' }
    ];



  }

  getMinutes(time: string): number {
    console.log(time);
    var splitted : number = time.split(':');
    return +splitted[0] * 60 + +splitted[1];
  }

  minutesToHourMinute(minutes :number): string {
    let h = Math.floor(minutes / 60);
    let m = minutes % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m}`;
  }

  createLabels(): void {
    var startMinutes:number = this.getMinutes('01:30');
    var endMinutes:number = this.getMinutes('05:30')
    this.label = [];
    while (startMinutes <= endMinutes) {
      this.label.push(this.minutesToHourMinute(startMinutes))
      startMinutes = startMinutes + 5;
    }
    console.log{this.labels}
  }

  getPassings(year): number[] {
    this.passingService.getPassings(year).subscribe(passings => this.passings = passings);

    let ret:number[] = [];
    let checkpassings = this.passings;

    for (const labeltime of this.label) {
      if( 0 < checkpassings.length && labeltime == checkpassings[0].time){
        //console.log('push: ' checkpassings[0].count);
        ret.push(checkpassings[0].count / 5)
        checkpassings.shift();
      }
      else {;
        //console.log('push: ' 0);
        ret.push(0);
      }
    }
    return ret;
    //console.log(this.data);
  }



  canvas: any;
  ctx: any;


  ngAfterViewInit() {

  }

}
