import { Component, OnInit } from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {
  Color,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  MultiDataSet,
} from 'ng2-charts';
import {CovidService} from '../../service/covid.service';
import {Event} from '@angular/router';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss']
})
export class DonutComponent implements OnInit {
  countries: string[] = [];
  country1: string = null;
  country2: string = null;
// Doughnut
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
  };
  public doughnutChartLabels: Label[] = ['Confirmed', 'Recovered', 'Active', 'Deaths'];
  public doughnutChartData: MultiDataSet = [[], []];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartLegend = true;
  public doughnutChartPlugins = [];
  public doughnutChartColors: Color[] = [
    {
      backgroundColor : ['yellow', 'green', 'red', 'black']
    },
    {
      backgroundColor : ['yellow', 'green', 'red', 'black']
    }
  ];
  constructor(private covidService: CovidService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }


  ngOnInit(): void {
    this.getCountries();
  }
  loadData(event: Event): void {
    if (this.country1 && this.country2) {
      this.clear();
      forkJoin([
        this.covidService.fromCountry(this.country1),
        this.covidService.fromCountry(this.country2)
      ]).subscribe(([country1, country2]) => {
        const lastCountry1 = country1.pop();
        const lastCountry2 = country2.pop();
        this.doughnutChartData[0][0] = lastCountry1.confirmed;
        this.doughnutChartData[0][1] = lastCountry1.recovered;
        this.doughnutChartData[0][2] = (lastCountry1.confirmed - lastCountry1.recovered - lastCountry1.deaths);
        this.doughnutChartData[0][3] = lastCountry1.deaths;
        this.doughnutChartData[1][0] = lastCountry2.confirmed;
        this.doughnutChartData[1][1] = lastCountry2.recovered;
        this.doughnutChartData[1][2] = (lastCountry2.confirmed - lastCountry2.recovered - lastCountry2.deaths);
        this.doughnutChartData[1][3] = lastCountry2.deaths;
      });
    }
  }
  getCountries(): void {
    this.covidService.getAll().subscribe( data => {
      this.countries = Object.keys(data);
    });
  }
  clear(): void {
    this.doughnutChartData = [];
    this.doughnutChartData.push([]);
    this.doughnutChartData.push([]);
  }
}
