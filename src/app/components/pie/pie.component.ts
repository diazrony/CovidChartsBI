import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import {SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color} from 'ng2-charts';
import {CovidService} from "../../service/covid.service";
import {Event} from "@angular/router";
@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {
  countries: string[] = [];
  country: string = null;
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Confirmed', 'Recovered', 'Active', 'Deaths'];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColor: Color[] = [
    {
      backgroundColor : ['yellow', 'green', 'red', 'black']
    },
  ];
  constructor(private covidService: CovidService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.getCountries();
  }
  loadData(event: Event): void {
    if (this.country) {
      this.clear();
      this.covidService.fromCountry(this.country).subscribe(data => {
        const last = data.pop();
        this.pieChartData[0] = last.confirmed;
        this.pieChartData[1] = last.recovered;
        this.pieChartData[2] = (last.confirmed - last.recovered - last.deaths);
        this.pieChartData[3] = last.deaths;
      });
    }
  }
  getCountries(): void {
    this.covidService.getAll().subscribe( data => {
      this.countries = Object.keys(data);
    });
  }
  clear(): void {
   this.pieChartData = [];
  }
}
