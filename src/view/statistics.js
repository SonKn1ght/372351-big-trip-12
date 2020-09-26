import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getMoney, getTransport, getTimeSpend} from '../utils/statistics.js';
import {ALL_POINTS, TRANSFER_POINTS} from '../const';

const TRANSFER_LABELS = [
  `🚕 TAXI`,
  `🚌 BUS`,
  `🚅 TRAIN`,
  `🚢 SHIP`,
  `🚊 TRANSPORT`,
  `🚗 DRIVE`,
  `✈ FLIGHT`,
];

const ACTIVITY_LABELS = [
  `🏨 CHECK-IN`,
  `🏰 SIGHTSEEING`,
  `🍴 RESTAURANT`
];

const MS_IN_HOURS = 3600000;
const BAR_HEIGHT = 55;


const TRIP_LABELS = TRANSFER_LABELS.concat(ACTIVITY_LABELS);

const renderMoneyChart = (moneyCtx, dataMoney) => {
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: TRIP_LABELS,
      datasets: [{
        data: dataMoney,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = (transportCtx, dataTransport) => {
  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: TRANSFER_LABELS,
      datasets: [{
        data: dataTransport,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeSpendChart = (timeSpendCtx, dataTimeSpend) => {

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: TRIP_LABELS,
      datasets: [{
        data: dataTimeSpend,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${Math.floor(val / MS_IN_HOURS)}H`
        }
      },
      title: {
        display: true,
        text: `TIME SPEND`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

export default class Statistics extends SmartView {
  constructor(eventItemsModel) {
    super();

    this._data = eventItemsModel.getEventItems();

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  _getTemplate() {
    return `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
  }

  _setCharts() {
    if (this._moneyChart !== null || this._transportChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._transportChart = null;
      this._timeSpendChart = null;
    }

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const moneyData = getMoney(this._data, ALL_POINTS);
    const transportData = getTransport(this._data, TRANSFER_POINTS);
    const timeSpendData = getTimeSpend(this._data, ALL_POINTS);

    moneyCtx.height = BAR_HEIGHT * moneyData.length;
    transportCtx.height = BAR_HEIGHT * transportData.length;
    timeSpendCtx.height = BAR_HEIGHT * timeSpendData.length;

    this._moneyChart = renderMoneyChart(moneyCtx, moneyData);
    this._transportChart = renderTransportChart(transportCtx, transportData);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, timeSpendData);
  }
}
