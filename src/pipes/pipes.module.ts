import { NgModule } from '@angular/core';
import { PlaceHolderPipe } from './place-holder/place-holder';
import { PipesCategoriaPipe } from './pipes-categoria/pipes-categoria';
import { PipesFilterEventoPipe } from './pipes-filter-evento/pipes-filter-evento';
import { GetNameUserPipe } from './get-name-user/get-name-user';
@NgModule({
	declarations: [PlaceHolderPipe,
    PipesCategoriaPipe,
    PipesFilterEventoPipe,
    GetNameUserPipe],
	imports: [],
	exports: [PlaceHolderPipe,
    PipesCategoriaPipe,
    PipesFilterEventoPipe,
    GetNameUserPipe]
})
export class PipesModule {}
