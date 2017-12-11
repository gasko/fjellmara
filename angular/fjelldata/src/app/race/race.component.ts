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
  ) {}
  alias: string = 'test';

  ngOnInit(): void {
    this.getAlias();
  }

  getAlias(): void {
    console.log(this.alias);
    console.log(this.route.snapshot.paramMap.keys);
    // console.log(+this.route.snapshot.paramMap.get Keys);
    this.alias = this.route.snapshot.paramMap.get('alias');
    console.log(this.alias);
  //this.heroService.getHero(alias)
  //.subscribe(hero => this.hero = hero);
  }
}
