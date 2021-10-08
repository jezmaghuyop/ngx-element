import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { TalkComponent } from './talk.component';

@NgModule({
  declarations: [TalkComponent],
  imports: [CommonModule],
  exports: [TalkComponent],
  entryComponents: [TalkComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TalkModule {
  customElementComponent: Type<any> = TalkComponent;

  constructor() { }

  ngDoBootstrap() { }
}
