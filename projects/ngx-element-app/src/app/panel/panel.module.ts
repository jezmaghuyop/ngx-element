import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel.component';



@NgModule({
  declarations: [PanelComponent],
  imports: [
    CommonModule
  ],
  exports: [PanelComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [PanelComponent]
})
export class PanelModule {
customElementComponent: Type<any> = PanelComponent;

constructor() { }

ngDoBootstrap() { }
}