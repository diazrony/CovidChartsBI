import { Component, OnInit } from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color, Colors, Label} from 'ng2-charts';
import {CovidService} from '../../service/covid.service';
import {Event} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {
  countries: string[] = [];
  country: string = null;
  lastDays: number[] = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Active' },
    { data: [], label: 'Recovered' }
  ];
  public barChartColors: Color[] = [{backgroundColor : ['red']}, {backgroundColor : ['green']}];
  constructor(private covidService: CovidService) { }

  ngOnInit(): void {
    this.getCountries();
    this.obtainLastDays();
  }
  loadData(event: Event): void {
    if (this.country) {
      this.clear();
      const obs: Observable<any>[] = new Array();
      for (let i = 0; i < this.lastDays.length; i++) {
        const date = new Date();
        date.setDate(this.lastDays[i]);
        date.setMonth(i);
        date.setHours(0, 0, 0, 0);
        let obsAct = new Observable();
        obsAct = this.covidService.twoDates(this.country, date, date);
        obs.push(obsAct);
      }
      console.log(obs);
      forkJoin(obs).subscribe((data) => {
        data.forEach((res, i) => {
          console.log(res);
          this.barChartData[0].data[i] = res[0].confirmed + res[0].recovered - res[0].deaths;
          this.barChartData[1].data[i] = res[0].recovered;
          this.barChartLabels.push(MONTH[i]);
        });
      });
      console.log(this.barChartData);
    }
  }
  getCountries(): void {
    this.covidService.getAll().subscribe( data => {
      this.countries = Object.keys(data);
    });
  }
  obtainLastDays(): void {
    const month = new Date().getMonth();
    let date = new Date( new Date().getFullYear(), month + 1, 0 );
    for (let i = 1; i <= month; i++) {
      date = new Date(new Date().getFullYear(), i , 0);
      this.lastDays.push(date.getDate());
    }
  }
  clear(): void {
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartLabels = [];
  }

}
