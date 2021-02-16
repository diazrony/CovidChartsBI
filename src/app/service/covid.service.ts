import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<any> {
    return this.httpClient.get<any>(environment.urlCovid);
  }

  public fromCountry(country: string): Observable<any[]> {
    return this.getAll().pipe(map(data => data[country]));
  }

  public twoDates(country: string, dateFrom: Date, dateTo: Date): Observable<any[]> {
    return this.fromCountry(country).pipe(
      map( countryData => countryData.filter(data => new Date(data.date) >= dateFrom && new Date(data.date) <= dateTo )));
}
}
