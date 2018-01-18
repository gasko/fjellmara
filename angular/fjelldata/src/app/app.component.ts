import { Component, OnInit } from '@angular/core';
import { MenuItem, RACE_MENU } from './menuitem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  menuitems:MenuItem[] = RACE_MENU;

  selectedRace:string = 'home';

  ngOnInit(): void {
    // this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'yourColor';
  }

  onSelect(race:string): void {
    this.selectedRace = race;
  }
}
