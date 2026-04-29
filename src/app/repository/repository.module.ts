import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { RepositoryRoutingModule } from './repository-routing.module';
import { RepositoryListComponent } from './repository-list/repository-list.component';

@NgModule({
  declarations: [
    RepositoryListComponent
  ],
  imports: [
    CommonModule,
    RepositoryRoutingModule,
    NgxPaginationModule
  ]
})
export class RepositoryModule {}
