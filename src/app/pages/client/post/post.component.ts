import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../../../core/services/service.service';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { ButtonModule } from 'primeng/button';


interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [FileUpload, ToastModule, CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  providers: [MessageService]
})
export class PostComponent {

  postForm: FormGroup;
  image: File | null = null;
  idUser: string | null = null;
  dangerLevel: string = 'Unknown';
  uploadedFiles: any[] = [];


  constructor(
    private fb: FormBuilder,
    private _service: ServiceService,
    private _user: UserService,
    private _router: Router,
    private messageService: MessageService
  ) {
    this.idUser = this._user.getUserIdFromToken();

    const controls = {
      name: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      governorate: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      crackWidth: new FormControl('', [Validators.required, Validators.min(0)])
    };

    this.postForm = fb.group(controls);
    this.postForm.get('crackWidth')?.valueChanges.subscribe(value => {
      this.dangerLevel = this.classifyCrack(value);
    });
  }

  classifyCrack(width_mm: number): string {
    if (width_mm < 3) {
      return "Low Danger 🟢";
    } else if (3 <= width_mm && width_mm < 25) {
      return "Medium Danger 🟡";
    } else {
      return "High Danger 🔴";
    }
  }

  onUpload(event: FileUploadEvent) {
    // Clear the uploadedFiles array before adding new files, if needed
    this.uploadedFiles = [];  // Optional: To clear previously uploaded files, otherwise remove this line
  
    // Loop through the files in the event and push them to the uploadedFiles array
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  
    // Set the first file as the image to be used in the create method
    if (event.files.length > 0) {
      this.image = event.files[0];
    }
  
    // Optional: Add a message indicating that the file upload was successful
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
  


  create() {
    if (!this.postForm.valid) {
      Swal.fire({
        icon: "error",
        title: "Please correct the errors in the form.",
        text: this.getFormValidationErrors(),
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }
  
    if (!this.image) {
      Swal.fire({
        icon: "error",
        title: "Please select an image",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  
    if (!this.idUser) {
      Swal.fire({
        icon: "error",
        title: "User not logged in",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  
    const fd = new FormData();
    fd.append('name', this.postForm.value.name);
    fd.append('location', this.postForm.value.location);
    fd.append('governorate', this.postForm.value.governorate);
    fd.append('description', this.postForm.value.description);
    fd.append('crackWidth', this.postForm.value.crackWidth);
    fd.append('dangerLevel', this.dangerLevel);
    fd.append('image', this.image);
    fd.append('idUser', this.idUser);


    // Update the timestamp with higher precision
    const createdAt = new Date().toISOString();
    fd.append('createdAt', createdAt);
  
    this._service.create(fd).subscribe({
      next: (res) => {
        Swal.fire({
          icon: "success",
          title: "Your post has been saved",
          showConfirmButton: false,
          timer: 1500
        });
        this._router.navigate(['/client/my-services']);
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Error saving post",
          showConfirmButton: false,
          timer: 1500
        });
        console.error('Error saving post', err);
      }
    });
  }
  
  getFormValidationErrors() {
    const errors: string[] = [];
    Object.keys(this.postForm.controls).forEach(key => {
      const controlErrors = this.postForm.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          errors.push(`${key} is ${keyError}`);
        });
      }
    });
    return errors.join(', ');
  }


detectingLocation = false;
locationError = false;
locationErrorMessage = '';

detectLocation() {
    this.detectingLocation = true;
    this.locationError = false;
    this.locationErrorMessage = '';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // You can use a geocoding service here to convert coordinates to address
                this.postForm.patchValue({
                    location: `${position.coords.latitude}, ${position.coords.longitude}`
                });
                this.detectingLocation = false;
            },
            (error) => {
                this.detectingLocation = false;
                this.locationError = true;
                this.locationErrorMessage = 'Unable to retrieve your location. Please check your browser settings.';
            }
        );
    } else {
        this.detectingLocation = false;
        this.locationError = true;
        this.locationErrorMessage = 'Geolocation is not supported by this browser.';
    }
}
}