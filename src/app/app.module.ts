import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PreloadAllModules, RouterModule } from '@angular/router';
import {
  NgbDatepickerModule,
  NgbModalModule,
  NgbModule,
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
} from '@ng-bootstrap/ng-bootstrap';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MenuComponent } from './components/menu/menu.component';
//Agregue
import { LibrosComponent } from './components/libros/libros.component';
import { ArticulosFamiliasComponent } from './components/articulos-familias/articulos-familias.component';
import { ArticulosComponent } from './components/articulos/articulos.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { MyInterceptor } from './shared/my-interceptor';

import { DatePickerAdapterISO } from './shared/DatePickerAdapterISO';
import { DatePickerParserFormatter } from './shared/DatePickerParserFormater';
import { DatePickerSpanish } from './shared/DatePickerSpanish';
import { FormFocusDirective } from './shared/form-focus.directive';
//Agregue
import { LibrosService } from './services/libros.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,

    //Ref Angular Routing
    RouterModule.forRoot([
      { path: '', redirectTo: '/inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'articulos', component: ArticulosComponent },
      //Agregar!!
      { path: 'libros', component: LibrosComponent },
      { path: 'articulosfamilias', component: ArticulosFamiliasComponent },
      { path: '**', redirectTo: '/inicio', pathMatch: 'full' },
    ]),
    NgbModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbDatepickerModule,
  ],
  declarations: [
    AppComponent,
    InicioComponent,
    MenuComponent,
    ArticulosFamiliasComponent,
    ArticulosComponent,
    ModalDialogComponent,
    //Agregue
    LibrosComponent,
  ],
  entryComponents: [ModalDialogComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },

    // ref angular ngbootrapt datepicker
    { provide: NgbDateAdapter, useClass: DatePickerAdapterISO },
    { provide: NgbDateParserFormatter, useClass: DatePickerParserFormatter }, // formato datepicker desde/hacia el imput
    { provide: NgbDatepickerI18n, useClass: DatePickerSpanish },
    //Agregue
    LibrosService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
