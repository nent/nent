import { NgModule } from '@angular/core'
import { defineCustomElements } from '@nent/core/dist/loader'
import { NView, NViewLink, NViewPrompt, NViews } from './directives/proxies'

defineCustomElements(window);

const DECLARATIONS = [
  // proxies
  NViews, NView, NViewPrompt, NViewLink
];

@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  imports: [],
  providers: [],
})
export class ComponentLibraryModule { }
