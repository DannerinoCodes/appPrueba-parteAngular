import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  public errores: string[];
  public titulo: string = "Soy el título del formulario";

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente()
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    })
  }

  update(): void {
    this.clienteService.update(this.cliente)

      .subscribe(cliente => {
        this.router.navigate(['/clientes']),
          Swal.fire(`El cliente ha sido actualizado con éxito`, `${cliente.nombre}`, 'success')
      }

      )
  }

  public create(): void {
    console.log("clickado!")
    this.clienteService.create(this.cliente)
      .subscribe(json => {
        this.router.navigate(['/clientes']),
          Swal.fire(`${json.mensaje}`, `${json.cliente.nombre}`, 'success')
      },
        err => {
          this.errores = err.error.errors as string[];
        }
      );
  }


}
