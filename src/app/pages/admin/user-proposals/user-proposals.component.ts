import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../../core/services/service.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-user-proposals',
    templateUrl: './user-proposals.component.html',
    styleUrls: ['./user-proposals.component.css'],
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, HttpClientModule]
})
export class UserProposalsComponent implements OnInit {

    services: any[] = [];
    first = 0;
    rows = 10;

    constructor(private _service: ServiceService) {}

    ngOnInit(): void {
        this.loadServices();
    }

    next() {
      this.first = this.first + this.rows;
  }

  prev() {
      this.first = this.first - this.rows;
  }

  reset() {
      this.first = 0;
  }

  pageChange(event: { first: number; rows: number }) {
      this.first = event.first;
      this.rows = event.rows;
  }

  isLastPage(): boolean {
      return this.services ? this.first + this.rows >= this.services.length : true;
  }

  isFirstPage(): boolean {
      return this.services ? this.first === 0 : true;
  }

    loadServices() {
        this._service.getAllServices().subscribe({
            next: (res) => {
                this.services = res;
            },
            error: (err) => {
                console.error('Error fetching services:', err);
            }
        });
    }


      delete(id: any){
    
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
           
            this._service.deleteService(id).subscribe({
              next: (res)=>{
                this.ngOnInit();
                Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success"
                });
              }
            })
    
          }
        });
    
      }
}
