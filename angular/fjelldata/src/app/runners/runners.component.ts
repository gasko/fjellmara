import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-runners',
  templateUrl: './runners.component.html',
  styleUrls: ['./runners.component.css']
})
export class RunnersComponent implements OnInit {

  runner = 'Kalle Kula';
  constructor() { }

  ngOnInit() {
  }

}
