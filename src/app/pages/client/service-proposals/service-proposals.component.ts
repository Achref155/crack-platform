import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalService } from '../../../core/services/proposal.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-service-proposals',
    templateUrl: './service-proposals.component.html',
    styleUrls: ['./service-proposals.component.css'],
    imports: [CommonModule]
})
export class ServiceProposalsComponent implements OnInit {
  id: string | null = null;
  proposals: any[] = [];

  constructor(
    private _proposal: ProposalService,
    private _act: ActivatedRoute,
    private _user: UserService
  ) {}

  ngOnInit(): void {
    this.id = this._act.snapshot.paramMap.get('id');
    if (this.id) {
      this._proposal.getProposalsByServiceId(this.id).subscribe({
        next: (res) => {
          this.proposals = res;
          console.log('Proposals:', this.proposals); // Log the proposals to verify the data
        },
        error: (err) => {
          console.error('Error loading proposals by service ID', err);
        }
      });
    } else {
      console.error('Service ID is null');
    }
}

  delete(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._proposal.deleteProposal(id).subscribe({
          next: (res) => {
            this.ngOnInit();
          },
          error: (err) => {
            console.error('Error deleting proposal', err);
          }
        });
      }
    });
  }

  accept(id: string): void {
    this._proposal.acceptProposal(id).subscribe({
      next: (res) => {
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error accepting proposal', err);
      }
    });
  }

  trackByProposalId(index: number, proposal: any): string {
    return proposal._id;
  }
}