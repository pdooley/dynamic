import { Component, OnInit} from '@angular/core';
import { TableDataSource } from '@vsolv/ui-kit/table';

@Component({
  selector: 'dynamic2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'frontend';

  constructor(source: TableDataSource){
    console.log("constructor() called");
  }

  ngOnInit(){
    console.log("ngOnInit() called.")

 

  }
}
