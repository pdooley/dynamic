import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LetDirective } from './directives/let.directive';
import { SafePipe } from './pipes';

@NgModule({
  imports: [CommonModule],
  declarations: [LetDirective, SafePipe],
  exports: [LetDirective, SafePipe],
})
export class UtilsModule {}
