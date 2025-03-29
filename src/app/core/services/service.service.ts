import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ServiceService {

  private url = 'http://127.0.0.1:5000/services/';

  constructor(private http: HttpClient) {}

  create(service: any){
    return this.http.post( this.url + 'create'  , service );
  }

  getAllServices(){
    return this.http.get<any[]>( this.url )
  }

  getServiceById( id: any ){
    return this.http.get( this.url + id );
  }

  getMyServices(id: any): Observable<any[]> { // ✅ Explicitly return an array
    return this.http.get<any[]>(this.url + 'my/' + id);
  }


  deleteService( id: any ){
    return this.http.delete( this.url + id );
  }
}
