import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { ServiceService } from '../../../core/services/service.service';
import { UserService } from '../../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-my-services',
    standalone: true,
    templateUrl: './my-services.component.html',
    styleUrls: ['./my-services.component.css'],
    imports: [CommonModule, RouterModule, PaginatorModule]
})
export class MyServicesComponent {
  services: any; // ✅ Ensure it's initialized as an array
  paginatedServices: any[] = []; // ✅ Store paginated data
  currentPage: number = 0;
  rowsPerPage: number = 5;

  constructor(private _service: ServiceService, private _user: UserService) {}

  ngOnInit(): void {
    this._service.getMyServices(this._user.getUserIdFromToken()).subscribe({
      next: (res) => {
        this.services = res;
        this.updatePaginatedServices();
      },
      error: (err) => console.error("Error fetching services:", err)
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page; // Zero-based index
    this.rowsPerPage = event.rows; // Rows per page
    this.updatePaginatedServices();
  }

  updatePaginatedServices() {
    const startIndex = this.currentPage * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedServices = this.services.slice(startIndex, endIndex);
  }

  trackById(index: number, item: any) {
    return item._id;
  }

  delete(id: any) {
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
          next: () => {
            this.ngOnInit();
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          },
          error: (err) => console.error("Error deleting service:", err)
        });
      }
    });
  }
}
