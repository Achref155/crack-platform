import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports: [CommonModule, TableModule, ButtonModule, HttpClientModule]
})
export class UserManagementComponent implements OnInit {

  users: any[] = [];
  userCount: number = 0;
  first = 0;
  rows = 10;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
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
    return this.users ? this.first + this.rows >= this.users.length : true;
}

isFirstPage(): boolean {
    return this.users ? this.first === 0 : true;
}

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: users => {
        console.log('Fetched users:', users);
        this.users = users;
        this.userCount = users.length;  // Add this line to count the number of users
      },
      error: err => console.error('Error loading users', err)
    });
  }
  

  banUser(userId: string) {
    this.adminService.banUser(userId).subscribe({
      next: () => {
        console.log('User banned successfully');
        this.loadUsers(); // Refresh list after operation
      },
      error: err => console.error('Error banning user', err)
    });
  }

  removeUser(userId: string) {


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
        
        this.adminService.removeUser(userId).subscribe({
          next: () => {
            this.ngOnInit();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
        });
      }
    });
  }

}