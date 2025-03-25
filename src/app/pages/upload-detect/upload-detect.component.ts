import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-upload-detect',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule
  ],
  templateUrl: './upload-detect.component.html',
  styleUrls: ['./upload-detect.component.css']
})
export class UploadDetectComponent {
  selectedFile: File | null = null;
  detectionResult: string | null = null;
  severityScore: number | null = null;
  detectionImgUrl: string | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  captureFromCamera(): void {
    // Implement camera capture logic here
    alert('Camera feature not implemented yet');
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.loading = true;
      this.errorMessage = null;
      
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post<any>('/api/upload', formData).subscribe({
        next: (response) => {
          this.detectionResult = response.message;
          this.severityScore = response.severityScore;
          this.detectionImgUrl = response.imageUrl;
          this.loading = false;
        },
        error: (error) => {
          console.error('Upload failed', error);
          this.errorMessage = 'Analysis failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  resetUpload(): void {
    this.selectedFile = null;
    this.detectionResult = null;
    this.severityScore = null;
    this.detectionImgUrl = null;
  }

  submitReport() {
    // Add your logic for submitting the report here
    console.log('Report submitted');
}
}