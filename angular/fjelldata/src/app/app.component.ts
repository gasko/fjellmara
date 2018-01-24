import { Component, OnInit } from '@angular/core';
import { MenuItem, RACE_MENU } from './menuitem';
import { AppGlobals } from './app.global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  deploy_path:string = "";
  constructor() {
    this.deploy_path = AppGlobals.DEPLOY_PATH;
  }

  menuitems:MenuItem[] = RACE_MENU;

  selectedRace:string = 'home';



  ngOnInit(): void {

  }

  onSelect(race:string): void {
    this.selectedRace = race;
  }
}
