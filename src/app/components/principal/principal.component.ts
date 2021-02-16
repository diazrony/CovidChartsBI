import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import {CovidService} from '../../service/covid.service';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  /* Variables */
  countries: string[] = [];
  country: string = null;
  dateInit: Date;
  dateEnd: Date;
  minCovDate: Date;
  maxCovDate: Date;
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Confirmed' },
    { data: [], label: 'Recovered' },
    { data: [], label: 'Active' },
    { data: [], label: 'Deaths' }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions & any = { responsive: true };
  public lineChartColors: Color[] = [
    {
      borderColor: 'yellow',
      backgroundColor: 'rgba(200,200,0,0.3)'
    },
    {
      borderColor: 'green',
      backgroundColor: 'rgba(0,210,0,0.3)'
    },
    {
      borderColor: 'red',
      backgroundColor: 'rgba(255,0,0,0.3)'
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgba(136,136,136,0.3)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  /* Variables */
  constructor(private covidService: CovidService, private datePipe: DatePipe) {
    this.minCovDate = new Date('2020-1-22');
    this.maxCovDate = new Date();
    this.maxCovDate.setDate(this.maxCovDate.getDate() - 1);
  }

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries(): void {
    this.covidService.getAll().subscribe( data => {
      this.countries = Object.keys(data);
    });
  }
  loadData( event: Event ): void {
    // Confirmed values
    if (this.country && this.dateEnd && this.dateInit) {
      // ForkJoin is method that obtain one array on observable and generate one array with they
      forkJoin([
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => val.confirmed))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => val.recovered))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(
          val => val.confirmed -  val.recovered - val.deaths))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => val.deaths))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(
          val => this.datePipe.transform(val.date, 'dd/MM/yy'))))
      ]).subscribe(([confirmed, recovered, active, deaths, list]) => {
        // Assigning value with variable
        this.lineChartData[0].data = confirmed;
        this.lineChartData[1].data = recovered;
        this.lineChartData[2].data = active;
        this.lineChartData[3].data = deaths;
        this.lineChartLabels = list;
      });
    }
  }
}
