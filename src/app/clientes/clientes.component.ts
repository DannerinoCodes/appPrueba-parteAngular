import { Component, OnInit } from '@angular/core';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  public clientes:Cliente[];
  paginador:any;
  constructor(private clienteService:ClienteService,
  private activatedRoute: ActivatedRoute) { }



  ngOnInit() {

    this.activatedRoute.paramMap.subscribe( params=>{
        let page:number= +params.get('page');

      if (!page){
        page=0;
      }
        this.clienteService.getClientes(page)
.subscribe( response=>{
  this.clientes=response.content as Cliente[]
  this.paginador=response;
});
  });
}




delete(cliente:Cliente):void{
  Swal.fire({
  title: `¿Está seguro de que quiere eliminar a ${cliente.nombre}`,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: '¡Sí, elimínalo!'
}).then((result) => {
  if (result.value) {
    this.clienteService.delete(cliente.id).subscribe(
      response=>{
        this.clientes = this.clientes.filter(cli=> cli!== cliente)
        Swal.fire(
          'Cliente eliminado',
          `Cliente ${cliente.nombre} eliminado con éxito`
        )
      }
    )
  }
})
}
}
