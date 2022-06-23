import { Component, ElementRef, OnInit } from '@angular/core';
//Ejemplo
import { Libro } from '../../models/libro';
import { ArticuloFamilia } from '../../models/articulo-familia';
//Ejemplo
import { LibrosService } from '../../services/libros.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-libro',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css'],
})
export class LibrosComponent implements OnInit {
  Titulo = 'Libros';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)',
  };
  AccionABMC = 'L'; // inicialmente inicia en el Listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...',
  };

  Items: Libro[] = null;
  RegistrosTotal: number;

  Pagina = 1; // inicia pagina 1

  // opciones del combo activo
  OpcionesActivo = [
    { Id: null, Nombre: '' },
    { Id: true, Nombre: 'SI' },
    { Id: false, Nombre: 'NO' },
  ];

  FormBusqueda = new FormGroup({
    //Modifique
    Titulo: new FormControl(null),
    Activo: new FormControl(null),
  });

  FormRegistro = new FormGroup({
    //Modifique
    IdLibro: new FormControl(0),
    //Modifique
    Titulo: new FormControl('', [
      Validators.required,
      Validators.minLength(0),
      Validators.maxLength(100),
    ]),

    Stock: new FormControl(null, [
      Validators.required,
      Validators.pattern('[0-9]{1,7}'),
    ]),

    Activo: new FormControl(true),
  });

  submitted = false;

  constructor(
    //private articulosService: MockArticulosService,
    //private articulosFamiliasService: MockArticulosFamiliasService,
    private LibrosService: LibrosService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {}

  Agregar() {
    this.AccionABMC = 'A';
    //Modifique
    this.FormRegistro.reset({ Activo: true, IdLibro: 0 });
    this.submitted = false;
  }

  // Buscar segun los filtros, establecidos en FormRegistro
  Buscar() {
    //Modifique
    this.LibrosService.get(
      //Modifique
      this.FormBusqueda.value.Titulo,
      this.FormBusqueda.value.Activo,
      this.Pagina
    ).subscribe((res: any) => {
      this.Items = res.Items;
      this.RegistrosTotal = res.RegistrosTotal;
    });
  }

  // Obtengo un registro especifico según el Id
  BuscarPorId(Item, AccionABMC) {
    window.scroll(0, 0); // ir al incio del scroll

    //Modifique
    this.LibrosService.getById(Item.IdLibro).subscribe((res: any) => {
      this.FormRegistro.patchValue(res);

      //formatear fecha de  ISO 8061 a string dd/MM/yyyy
      var arrFecha = res.FechaAlta.substr(0, 10).split('-');
      this.FormRegistro.controls.FechaAlta.patchValue(
        arrFecha[2] + '/' + arrFecha[1] + '/' + arrFecha[0]
      );

      this.AccionABMC = AccionABMC;
    });
  }

  Consultar(Item) {
    this.BuscarPorId(Item, 'C');
  }

  // comienza la modificacion, luego la confirma con el metodo Grabar
  Modificar(Item) {
    if (!Item.Activo) {
      this.modalDialogService.Alert(
        'No puede modificarse un registro Inactivo.'
      );
      return;
    }
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
    this.BuscarPorId(Item, 'M');
  }

  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };
    //Agregar esto!!!!!
    itemCopy.IdLibro = 0;

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaAlta.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.FechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == 'A') {
      //Modifique
      this.LibrosService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
      // modificar put
      //Modifique
      this.LibrosService.put(itemCopy.IdLibro, itemCopy).subscribe(
        (res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.Buscar();
        }
      );
    }
  }

  // representa la baja logica
  ActivarDesactivar(Item) {
    this.modalDialogService.Confirm(
      'Esta seguro de ' +
        (Item.Activo ? 'desactivar' : 'activar') +
        ' este registro?',
      undefined,
      undefined,
      undefined,
      () =>
        this.LibrosService.delete(Item.IdLibro).subscribe((res: any) =>
          this.Buscar()
        ),
      null
    );
  }

  // Volver/Cancelar desde Agregar/Modificar/Consultar
  Volver() {
    this.AccionABMC = 'L';
  }

  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }
}
