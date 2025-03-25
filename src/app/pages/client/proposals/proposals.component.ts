import { Component, OnInit } from '@angular/core';
import { ProposalService } from '../../../core/services/proposal.service';
import { UserService } from '../../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-proposals',
    templateUrl: './proposals.component.html',
    styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent implements OnInit {
  proposals: any[] = [];

  constructor(
    private _proposal: ProposalService,
    private _user: UserService
  ) {}

  ngOnInit(): void {
    const userId = this._user.getUserIdFromToken();
    console.log('User ID:', userId); // Add this line to verify the user ID
    if (userId) {
      this._proposal.getProposalsByUserId(userId).subscribe({
        next: (res) => {
          this.proposals = res;
          console.log('Proposals:', this.proposals); // Log the proposals to verify the data
        },
        error: (err) => {
          console.error('Error loading proposals', err);
        }
      });
    } else {
      console.error('User ID is null');
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
}