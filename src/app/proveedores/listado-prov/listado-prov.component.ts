import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from '../../servicios/proveedores.service';
import { trigger, state, style, animate, transition } from '@angular/animations'; // Animaciones

@Component({
  selector: 'app-listado-prov',
  templateUrl: './listado-prov.component.html',
  styleUrls: ['./listado-prov.component.css'],
  animations: [
    trigger('alerta', [ // alerta la hemos definido en HTML antes
      state('show', style({opacity: 1})), // El estado en el que está
      state('hide', style({opacity: 0})),
      transition('show => hide', animate('500ms ease-out')), // Cuando pasemos de show a hide...
      transition('hide => show', animate('500ms ease-in')) // Cuando pasemos de hide a show...
    ]) 
  ]// Lleva un array por si lleva varias animaciones
})
export class ListadoProvComponent implements OnInit {

  mensaje: string;
  mostrarAlerta:boolean = false;
  proveedores:any;
  id:string;

  constructor(private proveedoresService: ProveedoresService) { }

  ngOnInit() {
    this.cargarProveedores();
  }

  get estadoAlerta() { // Creamos un método
    return this.mostrarAlerta ? 'show' : 'hide' // si no se cumple, hide (y no se ve)
  }

  cargarProveedores(){ // Se ejecuta cuando se ejecuta el componente en ngOnInit
    this.proveedoresService.getProveedores()
            .subscribe((resp:any)=>{ // resp es respuesta
                this.proveedores = resp.proveedores; 

            }, error => {
              console.log(error);
            })
  }

  obtenerId(id){
    this.id = id
  }
  
  borrarProveedor() { // quitamos el id del parentesis y lo metemos arriba
    this.proveedoresService.deleteProveedor(this.id)
                           .subscribe((resp:any)=>{
                             this.mensaje = "El proveedor ha sido eliminado correctamente";
                             this.mostrarAlerta = true; // En este momento mostrarAlerta es true
                             this.cargarProveedores();
                             setTimeout(()=>{ // Apaga el mensaje anterior cuando hayan pasado "x" segundos
                              this.mostrarAlerta = false;
                             }, 2500); // 2 segundos
                           },(error:any)=>{
                             this.mensaje = 'Error de conexión con el servidor';
                             this.mostrarAlerta = true;
                             setTimeout(()=>{
                              this.mostrarAlerta = false;
                            }, 2500);
                           });
  }
}
