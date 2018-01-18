import { Component, AfterViewInit } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// export class AppComponent {
//   title = 'Fjelldata';
// }

export class AppComponent implements AfterViewInit {

      selectedRace:string = 'home';

       ngAfterViewInit(){
        // this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'yourColor';
      }

      onSelect(race: string): void {
        this.selectedRace = race;
      }
   }
