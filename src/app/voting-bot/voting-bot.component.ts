import { Component, OnInit } from '@angular/core';
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
import { CommonElementOptions } from 'chart.js';
import { Review } from '../../review';

Chart.register(LinearScale, BarController, BarElement, CategoryScale);

@Component({
  selector: 'app-voting-bot',
  templateUrl: './voting-bot.component.html',
  styleUrls: ['./voting-bot.component.scss'],
})
export class VotingBotComponent implements OnInit {
  opened: boolean = false;
  reviews: any[] = [];

  constructor(private afs: AngularFirestore) {}

  async ngOnInit() {
    await this.getReview();
    this.drawChart();
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
    this.afs
      .collection('review')
      .doc(id)
      .update({
        like: (data[targetIndex].data.like += 1),
      });
    this.updateChart();
    this.drawChart();
  }

  drawChart() {
    const canvas = document.querySelector('#review-chart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const [resName, resLike] = this.updateChart();
    this.updateAndDrawChart(ctx, resName, resLike);
    console.log(resLike);
  }

  updateChart() {
    const data = this.getReviewData();
    let resName = [];
    let resLike = [];
    for (let ele of data) {
      resName.push(ele.data.name);
      resLike.push(ele.data.like);
    }
    return [resName, resLike];
  }

  updateAndDrawChart(target: any, resName: any, resLike: any) {
    new Chart(<ChartItem>target, {
      type: 'bar',
      data: {
        labels: resName,
        datasets: [
          {
            label: '# of Votes',
            data: resLike,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
