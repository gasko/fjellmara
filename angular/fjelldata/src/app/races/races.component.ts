import { Component, OnInit } from '@angular/core';
import { Race } from '../race';
import { RaceService } from '../race.service';

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {
  selectedRace: Race;
  races: Race[];

  constructor(private raceService: RaceService) { }

  ngOnInit() {
    this.getRaces();
  }

  onSelect(race: Race): void {
    this.selectedRace = race;
  }

  getRaces(): void {
    this.raceService.getRaces().subscribe(races => this.races = races);
  }

}
