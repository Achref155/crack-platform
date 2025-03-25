import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { ServiceService } from '../../../core/services/service.service';
import { ChartModule } from 'primeng/chart';



@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule, ChartModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  userCount: number = 0;
  locationCount: number = 0;
  aiModelStatus: string = '';
  services: any;
  basicData: any;

  constructor(private adminService: AdminService, private _service: ServiceService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this._service.getAllServices().subscribe({
      next: (res) => {
        this.services = res;
      }
    });

    this.basicData = {
      labels: ['users', 'services', 'proposals', 'accepted proposal'],
      datasets: [
          {
              label: 'Sales',
              data: [540, 325, 702, 620],
              backgroundColor: [
                  'rgba(249, 115, 22, 0.2)',
                  'rgba(6, 182, 212, 0.2)',
                  'rgb(107, 114, 128, 0.2)',
                  'rgba(139, 92, 246, 0.2)',
              ],
              borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
              borderWidth: 1,
          },
      ],
  };
  }

  loadDashboardData() {
    this.adminService.getAllUsers().subscribe({
      next: users => this.userCount = users.length,
      error: err => console.error('Error loading users', err),
    });

      this.adminService.getAllLocations().subscribe({
        next: location => this.locationCount = location.length,
        error: err => console.error('Error loading locations', err)
    });

    // this.proposalService.getAllProposals().subscribe({
    //   next: proposals => this.proposalCount = proposals.length,
    //   error: err => console.error('Error loading proposals', err)
    // });

    // Dummy logic for proposals and AI status, replace with real service calls
    // this.proposalCount = 42; // Example static data
    this.aiModelStatus = 'Running'; // Example static status
  }
}