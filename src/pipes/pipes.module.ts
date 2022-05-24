import { NgModule } from '@angular/core';
import { PlaceHolderPipe } from './place-holder/place-holder';
import { PipesCategoriaPipe } from './pipes-categoria/pipes-categoria';
import { PipesFilterEventoPipe } from './pipes-filter-evento/pipes-filter-evento';
import { GetNameUserPipe } from './get-name-user/get-name-user';
import { GetNameEventoPipe } from './get-name-evento/get-name-evento';
import { GetNameZonaPipe } from './get-name-zona/get-name-zona';
@NgModule({
	declarations: [PlaceHolderPipe,
    PipesCategoriaPipe,
    PipesFilterEventoPipe,
    GetNameUserPipe,
    GetNameEventoPipe,
    GetNameZonaPipe],
	imports: [],
	exports: [PlaceHolderPipe,
    PipesCategoriaPipe,
    PipesFilterEventoPipe,
    GetNameUserPipe,
    GetNameEventoPipe,
    GetNameZonaPipe]
})
export class PipesModule {}
