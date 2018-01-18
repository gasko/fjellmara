import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PassingService } from '../passing.service';
import { Checkpoint } from '../checkpoint';

//import { raceService }  from '../race.service';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})

export class RaceComponent implements OnInit {

  checkpoints:any;
  selectedCheckpoint: Checkpoint;
  constructor(
    private route: ActivatedRoute,
    private passingService: PassingService,
    //private raceService: RaceService,
    //private location: Location
  ) {

  route.params.subscribe(val => {
    this.alias = this.getAlias();
    this.race = this.getRaceName();
    this.fetchCheckpoints(this.alias);
});
}
  alias: string;
  race: string;

  ngOnInit(): void {

  }

  onSelect(checkpoint: string): void {
    this.selectedCheckpoint = checkpoint;
  }

  getRaceName(): string {
    let alias = this.getAlias();
    switch(alias) {
      case "fjallmara": {
        return "Fjällmaraton";
      }
      case "27k": {
        return "Salomon 27K";
      }
      case "oppet-fjall": {
        return "Öppet Fjäll";
      }
      case "kvartsmara": {
        return "Kvartsmaraton";
      }
      case "valliste": {
        return "Välliste Runt";
      }
      case "copper-trail": {
        return "Copper Trail";
      }
      case "verticalk": {
        return "Vertical K";
      }
      case "bydalsfjallen22": {
        return "Bydalen Fjällmaraton 22K";
      }
      case "bydalsfjallen50": {
        return "Bydalen Fjällmaraton 50K";
      }
      default: {
        break;
      }
}
  }
  getAlias(): string {
    console.log(this.alias);
    console.log(this.route.snapshot.paramMap.keys);
    // console.log(+this.route.snapshot.paramMap.get Keys);
    return this.route.snapshot.paramMap.get('alias');
  }

  fetchCheckpoints(race:string) {
    this.passingService.getCheckpoints(race).subscribe(checkpoints =>
      {
        console.log(checkpoints);
        let temp: Checkpoint[] = [];
        for (let checkpoint of checkpoints){
          if(checkpoint.name == "start" || checkpoint.name == "pre finnish"){
            continue;
          }
          // else if(checkpoint.name == "finnish") {
          //   checkpoint.name = "Mål";
          // }

          temp.push(checkpoint);
        }
        this.checkpoints = temp;
      });
  }

}
