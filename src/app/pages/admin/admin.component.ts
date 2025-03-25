import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  user: any;


  constructor( private router: Router , private _user: UserService ){}


  ngOnInit(): void {
    
    this._user.getUserById( this._user.getUserIdFromToken() ).subscribe({
      next: (res)=>{
        this.user = res;
      }
    })

  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}