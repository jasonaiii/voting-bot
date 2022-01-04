import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Chart,
  ChartItem,
  Point,
  LinearScale,
  BarController,
  CategoryScale,
  BarElement,
} from 'chart.js';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Data } from './typing';

Chart.register(LinearScale, BarController, BarElement, CategoryScale);

@Component({
  selector: 'app-voting-bot',
  templateUrl: './voting-bot.component.html',
  styleUrls: ['./voting-bot.component.scss'],
})
export class VotingBotComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  opened: boolean = false;
  reviews: any[] = [];

  constructor(private afs: AngularFirestore) {}

  async ngOnInit() {
    await this.getReview();
    this.updateData();
    const [resName, resLike] = this.updateData();
    this.labels = resName;
    this.data = resLike;
    this.initChart();
  }

  getReviewData() {
    return this.reviews;
  }

  async getReview() {
    await this.afs
      .collection('review')
      .ref.get()
      .then((docs) => {
        docs.forEach((element) => {
          const data = element.data();
          this.reviews.push({
            data,
            id: element.id,
          });
        });
      });
  }

  addLike(event: any) {
    let targetIndex = event.path[2].attributes[2].value;
    const data = this.getReviewData();
    let id = data[targetIndex].id;
    const doc = this.afs.collection('review').doc(id).ref;
    this.afs.firestore.runTransaction((transaction) =>
      transaction.get(doc).then((data: any) => {
        const newLike = data.data().like + 1;
        transaction.update(doc, { like: newLike });
      })
    );

    // doc.update({
    //   like: (data[targetIndex].data.like += 1),
    // });
    const [resName, resLike] = this.updateData();
    this.labels = resName;
    this.data = resLike;
    const update = this.updateChart(resLike);
    update;
  }

  public data: number[] = [];
  public labels: string[] = [];
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  initChart() {
    this.barChartData = {
      labels: this.labels,
      datasets: [{ data: this.data, label: '# for votes' }],
    };
    return this.barChartData;
  }

  updateData() {
    const data = this.getReviewData();
    let resName = [];
    let resLike = [];
    for (let ele of data) {
      resName.push(ele.data.name);
      resLike.push(ele.data.like);
    }
    return [resName, resLike];
  }

  public updateChart(value: any): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = value;

    this.chart?.update();
  }
}
