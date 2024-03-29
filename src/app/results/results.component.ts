import { Component, Input, OnInit } from '@angular/core';
import { CalculatorFormValue } from '../calculator-form/calculator-form.component';
import { HouseSizeEnum } from '../models/house-size.enum';
import { ThermalInsulationEnum } from '../models/thermal-insulation.enum';
const defaultThermalInsulation = ThermalInsulationEnum.average;

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  private _formValue?: CalculatorFormValue;
  get formValue(): CalculatorFormValue | undefined {
    return this._formValue;
  }
  @Input()
  set formValue(value: CalculatorFormValue | undefined) {
    this._formValue = value;
    this.houseSize = this.gethouseSize(value);
    this.thermalInsulation =
      value?.thermalInsulation ?? defaultThermalInsulation;
  }

  houseSize = HouseSizeEnum.medium;
  gethouseSize(formValue: CalculatorFormValue | undefined): HouseSizeEnum {
    const size = formValue?.houseSize ?? 100;
    if (size >= 200) return HouseSizeEnum.large;
    else if (size >= 100) return HouseSizeEnum.medium;
    else return HouseSizeEnum.small;
  }

  thermalInsulation = defaultThermalInsulation;

  get showThermalInsulationNotice() {
    return this.thermalInsulation !== ThermalInsulationEnum.good;
  }

  constructor() {}

  ngOnInit(): void {}
}
