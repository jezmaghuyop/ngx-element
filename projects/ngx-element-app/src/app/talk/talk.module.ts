import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { TalkComponent } from './talk.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  declarations: [TalkComponent],
  imports: [CommonModule, NzButtonModule, NzTagModule],
  exports: [TalkComponent],
  entryComponents: [TalkComponent]
})
export class TalkModule {
  customElementComponent: Type<any> = TalkComponent;

  constructor() { }

  ngDoBootstrap() { }
}
