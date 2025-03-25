import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-ai-training',
  templateUrl: './ai-training.component.html',
  styleUrls: ['./ai-training.component.css']
})
export class AiTrainingComponent implements OnInit {

  trainingStatus: string = '';
  lastTrainingDate: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.checkTrainingStatus();
  }

  checkTrainingStatus() {
    this.adminService.trackAiTraining().subscribe({
      next: status => {
        this.trainingStatus = status.state;
        this.lastTrainingDate = status.lastTrainedOn;
      },
      error: err => console.error('Error loading AI training status', err)
    });
  }

  startTraining() {
    this.adminService.retrainModel({ newData: true }).subscribe({
      next: () => {
        console.log('AI training started successfully');
        this.checkTrainingStatus(); // Refresh status after starting training
      },
      error: err => console.error('Error starting AI training', err)
    });
  }
}