import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {

  @Input() titulo: string;
  @Input() tipo: string;
  @Input() nombre: string;
  constructor() { }

  ngOnInit() {}

}
