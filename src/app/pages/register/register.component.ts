import { Component } from '@angular/core';
  import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { Router, RouterModule } from '@angular/router';
  import { UserService } from '../../core/services/user.service';
  import { CommonModule } from '@angular/common';
  import Swal from 'sweetalert2';

  @Component({
      selector: 'app-register',
      imports: [RouterModule, ReactiveFormsModule, CommonModule],
      templateUrl: './register.component.html',
      styleUrls: ['./register.component.css']
  })
  export class RegisterComponent {

    registerForm: FormGroup;

    constructor(private fb: FormBuilder, private _user: UserService, private router: Router) {

      let controls = {
        firstname: new FormControl('', [Validators.required]),
        lastname: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        role: new FormControl('user') // Default role to 'user'
      }

      this.registerForm = fb.group(controls);

    }

    createAccount(){
      const registrationData = this.registerForm.value;
      registrationData.email = registrationData.email.trim();
      console.log('Registration payload:', registrationData);
      
      this._user.register(registrationData).subscribe({
        next: (res) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Registration successful! Redirecting to login...',
            showConfirmButton: false,
            timer: 1500
          }).then(() => this.router.navigate(['/login']));
        },
        error: (err) => {
          console.error('Registration Error:', err);
          let errorMessage = 'An error occurred';
          if (err.status === 400) {
            errorMessage = err.error?.message || 'Registration failed. Please check your input.';
          }
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: errorMessage,
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }

    updateRole(userId: string, role: string) {
      this._user.updateUserRole(userId, role).subscribe({
        next: (res) => {
          console.log('User role updated to:', role);
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          }
        },
        error: (err) => {
          console.error('Error updating role', err);
        }
      });
    }
  }