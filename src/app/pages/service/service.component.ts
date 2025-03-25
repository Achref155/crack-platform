import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../core/services/service.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProposalService } from '../../core/services/proposal.service';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-service',
    imports: [ReactiveFormsModule],
    templateUrl: './service.component.html',
    styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  id: any;
  service: any;
  proposalForm: FormGroup;
  proposals: any[] = [];

  constructor(
    private _service: ServiceService,
    private _act: ActivatedRoute,
    private fb: FormBuilder,
    private _proposal: ProposalService,
    private _user: UserService
  ) {
    let controls = {
      price: new FormControl('', [Validators.required]),
      days: new FormControl('', [Validators.required]),
      cover: new FormControl('', [Validators.required]),
    };

    this.proposalForm = fb.group(controls);
  }

  ngOnInit(): void {
    this.id = this._act.snapshot.paramMap.get('id');
    this.getServiceProposals();
    this._service.getServiceById(this.id).subscribe({
      next: (res) => {
        this.service = res;
      },
      error: (err) => {
        console.error('Error loading service', err);
      }
    });
  }

  scroll() {
    window.scroll(0, 1000);
  }

  getServiceProposals() {
    this._proposal.getProposalsByServiceId(this.id).subscribe({
      next: (res) => {
        this.proposals = res;
        console.log(this.proposals);
      },
      error: (err) => {
        console.error('Error loading proposals', err);
      }
    });
  }

  send() {
    if (!this._user.isLoggedIn()) {
      Swal.fire({
        icon: "error",
        title: "Please login to send a proposal",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    let data = {
      ...this.proposalForm.value,
      idUser: this._user.getUserIdFromToken(),
      idService: this.id
    };

    this._proposal.create(data).subscribe({
      next: (res) => {
        this.getServiceProposals();
        this.proposalForm.reset();
      },
      error: (err) => {
        console.error('Error sending proposal', err);
      }
    });
  }
}