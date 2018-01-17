import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

//import { raceService }  from '../race.service';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})

export class RaceComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    //private raceService: RaceService,
    //private location: Location
  ) {
  route.params.subscribe(val => {
    this.alias = this.getRaceName();
});
}
  alias: string = 'test';

  ngOnInit(): void {
    //this.getAlias();
  }

  getRaceName(): string {
    let alias = this.getAlias();
    switch(alias) {
      case "fjallmara": {
        return "Fjällmaraton";
        break;
      }
      case "27k": {
        return "Salomon 27K";
        break;
      }
      case "oppet-fjall": {
        return "Öppet Fjäll";
        break;
      }
      case "kvartsmara": {
        return "Kvartsmaraton";
        break;
      }
      case "valliste": {
        return "Välliste Runt";
        break;
      }
      case "copper-trail": {
        return "Copper Trail";
        break;
      }
      case "verticalk": {
        return "Vertical K";
        break;
      }
      case "bydalsfjallen": {
        return "Bydalen Fjällmaraton";
        break;
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
}
