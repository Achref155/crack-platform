import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../../../core/services/service.service';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  postForm: FormGroup;
  image: File | null = null;
  idUser: string | null = null;
  dangerLevel: string = 'Unknown';

  constructor(
    private fb: FormBuilder,
    private _service: ServiceService,
    private _user: UserService,
    private _router: Router
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

  selectImage(e: any) {
    this.image = e.target.files[0];
  }

  create() {
    if (!this.postForm.valid) {
      Swal.fire({
        position: "top-end",
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
        position: "top-end",
        icon: "error",
        title: "Please select an image",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  
    if (!this.idUser) {
      Swal.fire({
        position: "top-end",
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
          position: "top-end",
          icon: "success",
          title: "Your post has been saved",
          showConfirmButton: false,
          timer: 1500
        });
        this._router.navigate(['/client/my-services']);
      },
      error: (err) => {
        Swal.fire({
          position: "top-end",
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