import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';

import { UtilsModule } from '@vsolv/ui-kit/utils';

import { CrumbsComponent } from './components/crumbs/crumbs.component';
import { MenuLinkPickerComponent } from './components/menu-link-picker/menu-link-picker.component';
import { NavigationPanelComponent } from './components/navigation-panel/navigation-panel.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // Angular Material
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatDividerModule,
    OverlayModule,
    // Utils
    NgPipesModule,
    UtilsModule,
  ],
  declarations: [NavigationPanelComponent, MenuLinkPickerComponent, CrumbsComponent],
  exports: [NavigationPanelComponent, MenuLinkPickerComponent, CrumbsComponent],
})
export class LinksModule {}
