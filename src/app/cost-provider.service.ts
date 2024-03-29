import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HouseSizeEnum } from './models/house-size.enum';

export interface IMinMax {
  min: number;
  max: number;
}
export interface IHouseSizeMinMax {
  max100m: IMinMax;
  max200m: IMinMax;
  min200m: IMinMax;
}

export interface IHouseSizeAvg {
  max100m: {
    avg: number;
  };
  max200m: {
    avg: number;
  };
  min200m: {
    avg: number;
  };
}

export interface ICost {
  name: string;
  installation: {
    external: IMinMax;
    internal: IHouseSizeAvg;
    cauldron: IHouseSizeAvg;
  };
  yearlyAvg: IHouseSizeMinMax;
}

@Injectable({
  providedIn: 'root',
})
export class CostProviderService {
  constructor(private http: HttpClient) {}

  public costs$() {
    const file$ = this.http.get('/assets/costs.csv', { responseType: 'text' });
    return file$.pipe(
      map((response) => {
        const rows = response.split('\n');
        rows.splice(0, 3);
        return rows.map(this.mapRowToCost);
      })
    );
  }

  getYearlyAverage(c: ICost, houseSize: HouseSizeEnum) {
    return this.getAvgFromMinMax(
      this.getValueForSizeMinMax(c.yearlyAvg, houseSize)
    );
  }

  getInstalationCost(c: ICost, houseSize: HouseSizeEnum): number {
    return (
      this.getValueForSizeAvg(c.installation.cauldron, houseSize).avg +
      this.getAvgFromMinMax(c.installation.external) +
      this.getValueForSizeAvg(c.installation.internal, houseSize).avg
    );
  }

  getValueForSizeAvg(size: IHouseSizeAvg, houseSize: HouseSizeEnum) {
    switch (houseSize) {
      case HouseSizeEnum.small:
        return size.max100m;
      case HouseSizeEnum.medium:
      default:
        return size.max200m;
      case HouseSizeEnum.large:
        return size.min200m;
    }
  }

  getValueForSizeMinMax(size: IHouseSizeMinMax, houseSize: HouseSizeEnum) {
    switch (houseSize) {
      case HouseSizeEnum.small:
        return size.max100m;
      case HouseSizeEnum.medium:
      default:
        return size.max200m;
      case HouseSizeEnum.large:
        return size.min200m;
    }
  }

  getAvgFromMinMax(minMax: IMinMax) {
    return (minMax.min + minMax.max) / 2;
  }

  private mapRowToCost(value: string): ICost {
    const row = value.split(',');
    const name = row.splice(0, 1)[0];
    const rowNumbers = row.map((r) => Number.parseInt(r));
    return {
      name: name,
      installation: {
        external: {
          min: rowNumbers[0],
          max: rowNumbers[1],
        },
        internal: {
          max100m: { avg: rowNumbers[2] },
          max200m: { avg: rowNumbers[3] },
          min200m: { avg: rowNumbers[4] },
        },
        cauldron: {
          max100m: { avg: rowNumbers[5] },
          max200m: { avg: rowNumbers[6] },
          min200m: { avg: rowNumbers[7] },
        },
      },
      yearlyAvg: {
        max100m: {
          min: rowNumbers[8],
          max: rowNumbers[9],
        },
        max200m: {
          min: rowNumbers[10],
          max: rowNumbers[11],
        },
        min200m: {
          min: rowNumbers[12],
          max: rowNumbers[13],
        },
      },
    };
  }
}
