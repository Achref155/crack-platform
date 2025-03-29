import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../core/services/service.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { DataView } from 'primeng/dataview';



declare const google: any; // Declare if types are not installed

@Component({
    selector: 'app-services',
    imports: [RouterModule, FormsModule, ButtonModule, SelectButton, DataView, CommonModule],
    templateUrl: './services.component.html',
    styleUrl: './services.component.css',
    standalone: true,
    providers: [ServiceService]
})
export class ServicesComponent {

  services: any;
  
  layout: 'list' | 'grid' = 'list'; // Explicitly define the type and set a default value
  options = [
      { label: 'List', value: 'list' },
      { label: 'Grid', value: 'grid' }
  ];

  constructor(private _service: ServiceService) {}

  ngOnInit(): void {
    this._service.getAllServices().subscribe({
      next: (res) => {
        this.services = res;
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadGoogleMapsScript(() => this.initMap());
  }

  loadGoogleMapsScript(callback: () => void): void {
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCLWHckSE6xVZcMfdxJ4aMvIET_XSqWrwM`;
      script.async = true;
      script.defer = true;
      script.onload = callback; // Ensure callback only fires when script has loaded
      document.head.appendChild(script);
    } else {
      callback();
    }
  }

  initMap(): void {
    if (typeof google !== 'undefined' && google.maps) {
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });

      new google.maps.Marker({
        position: { lat: -34.397, lng: 150.644 },
        map,
        title: "Hello World!",
      });
    }
  }
}