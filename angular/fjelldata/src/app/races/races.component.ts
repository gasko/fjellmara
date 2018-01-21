import { Component, OnInit } from '@angular/core';
import { Race } from '../race';
import { DataService } from '../data.service';

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {
  selectedRace: Race;
  races: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getRaces();
  }

  onSelect(race: Race): void {
    this.selectedRace = race;
  }

  getRaces(): void {
    this.dataService.getRaces().subscribe(races => this.races = races);
  }

}
