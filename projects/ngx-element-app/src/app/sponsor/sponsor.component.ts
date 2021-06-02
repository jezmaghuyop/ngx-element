import { Component, OnInit, Input } from '@angular/core';

@Component({
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss']
})
export class SponsorComponent implements OnInit {
  @Input() image: string;
  @Input() name: string;

  constructor() { }

  ngOnInit() {
  }

}
