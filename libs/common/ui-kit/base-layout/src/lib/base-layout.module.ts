import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

import { LinksModule } from '@vsolv/ui-kit/links';

import { PageComponent } from './components/page/page.component';
import { ResponsiveSidenavComponent } from './components/responsive-sidenav/responsive-sidenav.component';
import { ScaffoldComponent } from './components/scaffold/scaffold.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    // Material
    MatSidenavModule,
    MatDividerModule,

    // VectorSolv
    LinksModule,
  ],
  declarations: [ToolbarComponent, ResponsiveSidenavComponent, ScaffoldComponent, PageComponent],
  exports: [ToolbarComponent, ResponsiveSidenavComponent, ScaffoldComponent, PageComponent],
})
export class BaseLayoutModule {}
