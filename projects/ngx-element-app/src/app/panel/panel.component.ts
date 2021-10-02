import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { stringify } from 'querystring';

@Component({
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  
  @ViewChild('sponsors') sponsors: ElementRef<HTMLElement>;

  show() {
    const el = document.createElement('ws-sponsor') as HTMLElement & {image: string, name: string};
    el.image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/JetBrains_Logo_2016.svg/368px-JetBrains_Logo_2016.svg.png';
    el.name = 'Jetbrains';
    this.sponsors.nativeElement.appendChild(el);
  }

  hide() {
    this.sponsors.nativeElement.removeChild(this.sponsors.nativeElement.firstChild);
  }

  change() {
    (this.sponsors.nativeElement.firstChild as HTMLElement & {image: string, name: string}).name = 'Test';
  }
}
