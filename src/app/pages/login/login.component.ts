import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginInProgress = false;

  constructor(
    private fb: FormBuilder,
    private _user: UserService,
    private router: Router
  ) {
    this.loginForm = fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    if (this.loginInProgress) {
      return; // Prevent multiple submissions
    }

    if (this.loginForm.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Please fill in all required fields",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    this.loginInProgress = true;
    const loginData = this.loginForm.value;
    loginData.email = loginData.email.trim();
    loginData.password = loginData.password.trim(); // Add trim for password

    console.log('Login payload:', loginData);
    this._user.login(loginData).subscribe({
      next: (res: any) => {
        this.loginInProgress = false;
        if (res.token && res.user) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          console.log('Stored user data:', res.user);

          if (res.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/client']);
          }
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Invalid response from server",
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
      error: (err) => {
        this.loginInProgress = false;
        console.error('Login Error Details:', err);
      
        // Try to extract the error message from the response
        const errorMessage = err.error?.message || err.error?.detail || 'Authentication failed';
      
        Swal.fire({
          icon: "error",
          title: errorMessage,
          showConfirmButton: false,
          timer: 1500
        });
      }
      
    });
  }
}