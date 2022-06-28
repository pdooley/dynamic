import { ClipboardModule } from '@angular/cdk/clipboard';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';

import { UtilsModule } from '@vsolv/ui-kit/utils';

import { DataTableComponent } from './components/data-table/data-table.component';
import { TableColumnDirective } from './directives/table-column.directive';
import { ColValuePipe } from './pipes/column-value.pipe';
import { TemplateByIdPipe } from './pipes/template-by-id.pipe';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // Angular CDK
    ClipboardModule,
    CdkTableModule,

    // Angular Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatRippleModule,
    MatSnackBarModule,
    MatChipsModule,
    MatButtonModule,

    // Misc
    NgPipesModule,
    UtilsModule,
  ],
  declarations: [DataTableComponent, TableColumnDirective, TemplateByIdPipe, ColValuePipe],
  exports: [DataTableComponent, TableColumnDirective],
  providers: [TemplateByIdPipe],
})
export class TableModule {}
