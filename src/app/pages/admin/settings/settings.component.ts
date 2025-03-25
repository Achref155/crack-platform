import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [CommonModule,FormsModule]

})
export class SettingsComponent implements OnInit {

  aiThreshold: number = 0;
  imageStorageLimit: number = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings() {
    this.adminService.getSettings().subscribe({
      next: settings => {
        this.aiThreshold = settings.aiThreshold;
        this.imageStorageLimit = settings.imageStorageLimit;
      },
      error: err => console.error('Error loading settings', err)
    });
  }

  updateSettings() {
    const updatedSettings = {
      aiThreshold: this.aiThreshold,
      imageStorageLimit: this.imageStorageLimit,
    };

    this.adminService.updateSettings(updatedSettings).subscribe({
      next: () => console.log('Settings updated successfully'),
      error: err => console.error('Error updating settings', err)
    });
  }
}