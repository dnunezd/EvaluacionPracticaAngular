import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { RepositoryRoutingModule } from './repository-routing.module';
import { RepositoryListComponent } from './repository-list/repository-list.component';
import { RepositoryDetailComponent } from './repository-detail/repository-detail.component';

@NgModule({
  declarations: [
    RepositoryListComponent,
    RepositoryDetailComponent
  ],
  imports: [
    CommonModule,
    RepositoryRoutingModule,
    NgxPaginationModule
  ]
})
export class RepositoryModule {}
