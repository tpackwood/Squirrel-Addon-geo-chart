import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SquirrelHelper } from '../squirrel-helper/squirrel-helper';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
declare const google: any;


@Component({
  selector: 'app-addon',
  templateUrl: './addon.component.html',
  styleUrls: ['./addon.component.scss']
})
export class AddonComponent extends SquirrelHelper implements OnInit, AfterViewInit {

  debugging: boolean = true;

  apiKey: string;

  chart: any;

  scripts: any;
  showmap: boolean = false;
  httpClient: HttpClient;

  apiLoaded: Observable<boolean>;

  mapOptions: any = {

  }

  states: any = [];
  statesValues: any = [];
  statesMapping: any = [['State', 0, '']];

  bgColor: any;
  valueColors: any = [];
  novalueColor: any;

  tooltipDisabled: any;
  tooltipValueLabel: any;
  tooltipValuePrefix: any = '';
  tooltipValueSuffix: any = '';



  constructor(httpClient: HttpClient) {
    super();

    this.httpClient = httpClient;

  }

  ngOnInit(): void {
    this.initWithSquirrel();


    google.charts.load('current', {
      'packages':['geochart'],
    });
    // google.charts.setOnLoadCallback(this.drawRegionsMap(this.statesMapping));
  }

  drawRegionsMap(statesMapping: any) {
    console.log('hello');
    console.log(google.visualization);


    if (google.visualization.DataTable != undefined) {
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn('string', 'State');
      dataTable.addColumn('number', 'Value');
      dataTable.addColumn({type: 'string', role: 'tooltip', p:{html:true}})

      console.log('statesmapping length: ', statesMapping.length)
      if(statesMapping.length <= 1) {
        statesMapping.push(['test',1,'tester']);
      }
      else if(statesMapping[1][0] != 'test') {
        console.log(statesMapping[1][0]);
        for(var i = 1; i <= statesMapping.length-1; i++) {
          console.log(statesMapping);
          if(statesMapping[i].length > 2) {
            statesMapping[i][2] = `<h5>${this.tooltipValueLabel != undefined ? this.tooltipValueLabel : 'Value:'} ${this.tooltipValuePrefix}${statesMapping[i][1]}${this.tooltipValueSuffix}</h5>`
          } else {
            statesMapping[i].push(`<h5>${this.tooltipValueLabel != undefined ? this.tooltipValueLabel : 'Value:'} ${this.tooltipValuePrefix}${statesMapping[i][1]}${this.tooltipValueSuffix}</h5>`)
          }
        }
      } else {
        statesMapping.push(['test',1,'tester'])
      }
      console.log(statesMapping);
      dataTable.addRows(statesMapping);
      // dataTable.addRows([
      //   ['State', 0],
      //   ['Alabama', 0],
      //   ['Alaska', 1],
      //   ['Arizona', 2],
      //   ['Arkansas', 3],
      //   ['California', 0],
      //   ['Colorado', 1],
      //   ['Connecticut', 2],
      //   ['Delaware', 3],
      //   ['Florida', 0],
      //   ['Georgia', 1],
      //   ['Hawaii', 2],
      //   ['Idaho', 3],
      //   ['Illinois', 0],
      //   ['Indiana', 1],
      //   ['Iowa', 2],
      //   ['Kansas', 3],
      //   ['Kentucky', 0],
      //   ['Louisiana', 1],
      //   ['Maine', 2],
      //   ['Maryland', 3],
      //   ['Massachusetts', 0],
      //   ['Michigan', 1],
      //   ['Minnesota', 2],
      //   ['Mississippi', 3],
      //   ['Missouri', 0],
      //   ['Montana', 1],
      //   ['Nebraska', 2],
      //   ['Nevada', 3],
      //   ['New Hampshire', 0],
      //   ['New Jersey', 1],
      //   ['New Mexico', 2],
      //   ['New York', 3],
      //   ['North Carolina', 0],
      //   ['North Dakota', 1],
      //   ['Ohio', 2],
      //   ['Oklahoma', 3],
      //   ['Oregon', 0],
      //   ['Pennsylvania', 1],
      //   ['Rhode Island', 2],
      //   ['South Carolina', 3],
      //   ['South Dakota', 0],
      //   ['Tennessee', 1],
      //   ['Texas', 2],
      //   ['Utah', 3],
      //   ['Vermont', 0],
      //   ['Virginia', 1],
      //   ['Washington', 2],
      //   ['West Virginia', 3],
      //   ['Wisconsin', 0],
      //   ['Wyoming', 1]
      // ]);

      var options = {
        backgroundColor: this.bgColor,
        datalessRegionColor: this.novalueColor,
        legend: 'none',
        tooltip: {
          trigger: this.tooltipDisabled ? 'none' : 'focus',
          isHtml: true,
          textStyle: {
            color: 'black'
          }
        },
        region: "US",
        resolution: "provinces",
        colors: this.valueColors,
        chartArea: {
          // leave room for y-axis labels
          width: '94%'
        },
        width: '100%'
      };

      var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

      google.visualization.events.addListener(chart, 'select', () => {
        var selection = chart.getSelection();
        if (selection.length > 0) {
          var selectedState = this.statesMapping[selection[0].row][0];
          //window.open('http://' + data.getValue(selection[0].row, 2), '_blank');
        }
        console.log("selection: ");
        console.log(selectedState);
        this.sendMessage(selectedState);
      });

      chart.draw(dataTable, options);
    } else {
      this.drawRegionsMap(statesMapping);
    }
  }

  mapClickHandler(chart: any) {
    console.log(chart);
    var selection = chart.getSelection();
    // var message = '';
    // for (var i = 0; i < selection.length; i++) {
    //     var item = selection[i];
    //     if (item.row != null && item.column != null) {
    //         message += '{row:' + item.row + ',column:' + item.column + '}';
    //     } else if (item.row != null) {
    //         message += '{row:' + item.row + '}';
    //     } else if (item.column != null) {
    //         message += '{column:' + item.column + '}';
    //     }
    // }
    // if (message == '') {
    //     message = 'nothing';
    // }
    console.log("selection: ");
    console.log(selection);
    this.sendMessage(selection);
}

  ngAfterViewInit(): void {
  }

  loadMap() {
    console.log('loading map');
    console.log(this.statesMapping);

    // google.charts.load('current', {
    //   'packages':['geochart'],
    //   'mapsApiKey': this.apiKey
    // });
    // google.charts.setOnLoadCallback(this.drawRegionsMap(this.statesMapping));

  }


  override onSetPosition(position: any): void {
    super.onSetPosition(position);

    console.log('position reset');
    this.drawRegionsMap(this.statesMapping);
  }

  override onSetSize(size: any): void {
    super.onSetSize(size);

    console.log('size reset');
    this.drawRegionsMap(this.statesMapping);
  }

  mapStates(): void {
    if(this.statesValues && this.states) {
      this.statesMapping = [['State', 0, '']];

      this.states.map((state: any, index: number) => {
        console.log(state);
        if(state) {
          console.log("mapping state: ", state);

          let newStateValue;
          this.statesValues[index] ? newStateValue = this.statesValues[index] : newStateValue = 0;
          console.log('newstatevalue', newStateValue);
          this.statesMapping.push([state, newStateValue])
        }

      })
    }

    console.log('stateMapping complete');
    console.log(this.statesMapping);
  }

  override onInitState(state: any): void {
    super.onInitState(state);

    if(this.debugging) {console.log("INITIALIZING STATE")};
    if (state != null) {
      if(state.states) {
        this.states = state.states.flat();
        if(this.debugging) {console.log("states:", this.states)};
      }
      if(state.statesValues) {
        this.statesValues = state.statesValues.flat();
        if(this.debugging) {console.log("statesValues:", this.statesValues)};
      }
      if(state.bgColor) {
        if(this.debugging) {console.log("bgColor:", state.bgColor)};

        this.bgColor = state.bgColor;
        if(this.statesMapping.length > 1) this.drawRegionsMap(this.statesMapping);
      }
      if(state.valueColors) {
        if(this.debugging) {console.log("valueColors:", state.valueColors[0])};

        this.valueColors = state.valueColors[0];
        if(this.statesMapping.length > 1) this.drawRegionsMap(this.statesMapping);
      }
      if(state.novalueColor) {
        if(this.debugging) {console.log("novalueColor:", state.novalueColor)};

        this.novalueColor = state.novalueColor;
        if(this.statesMapping.length > 1) this.drawRegionsMap(this.statesMapping);
      }
      if(state.tooltipDisabled) {
        if(this.debugging) {console.log("tooltipDisabled:", state.tooltipDisabled)};
        this.tooltipDisabled = state.tooltipDisabled
      }
      if(state.tooltipValueLabel) {
        if(this.debugging) {console.log("tooltipValueLabel:", state.tooltipValueLabel)};
        this.tooltipValueLabel = state.tooltipValueLabel
      }
      if(state.tooltipValuePrefix) {
        if(this.debugging) {console.log("tooltipValuePrefix:", state.tooltipValuePrefix)};
        this.tooltipValuePrefix = state.tooltipValuePrefix
      }
      if(state.tooltipValueSuffix) {
        if(this.debugging) {console.log("tooltipValueSuffix:", state.tooltipValueSuffix)};
        this.tooltipValueSuffix = state.tooltipValueSuffix
      }
      if(state.apiKey) {
        if(this.debugging) {console.log("apiKey:", state.apiKey)};
        this.apiKey = state.apiKey
      }

      this.mapStates();
      setTimeout(() => {
        console.log(google.visualization.DataTable);
        this.drawRegionsMap(this.statesMapping)
      }, 1000);
    }
  }

  override onPropertyChange(property: any, value: any): void {
    super.onPropertyChange(property, value);

    if(this.debugging) {console.log("PROPERTY CHANGE DETECTED")};
    switch (property) {
      case 'apiKey':
        if(this.debugging) {console.log("apiKey:", value)};
        this.apiKey = value;
        this.loadMap();
        break;
      case 'states':
        this.states = value.flat();
        if(this.debugging) {console.log("states:", this.states)};

        if(this.statesValues.length > 0) this.mapStates();
        if(this.statesMapping.length > 1) this.drawRegionsMap(this.statesMapping);

        break;
      case 'statesValues':
        this.statesValues = value.flat();
        if(this.debugging) {console.log("statesValues:", this.statesValues)};

        if(this.states.length > 0) this.mapStates();
        if(this.statesMapping.length > 1) this.drawRegionsMap(this.statesMapping);

        break;
      case 'bgColor':
        if(this.debugging) {console.log("bgColor:", value)};

        this.bgColor = value;
        if(this.statesMapping.length > 1) this.drawRegionsMap(this.statesMapping);

        break;
      case 'valueColors':
        if(this.debugging) {console.log("valueColors:", value[0])};

        this.valueColors = value[0];
        if(this.statesMapping.length > 1) this.drawRegionsMap(this.statesMapping);

        break;
      case 'novalueColor':
        if(this.debugging) {console.log("novalueColor:", value)};

        this.novalueColor = value;
        if(this.statesMapping.length > 1) this.drawRegionsMap(this.statesMapping);

        break;
      case 'tooltipValuePrefix':
        if(this.debugging) {console.log("tooltipValuePrefix:", value)};
        this.tooltipValuePrefix = value;

        break;
      case 'tooltipValueSuffix':
        if(this.debugging) {console.log("tooltipValueSuffix:", value)};
        this.tooltipValueSuffix = value;

        break;
      case 'response':
          if(this.debugging) {console.log("response:", value)};

          this.sendMessage(value);

          break;
    }
  }

  override onPropertyChangesComplete(): void {
    super.onPropertyChangesComplete();
    console.log('properchanges completed');
  }

  /**
   * Send back select image's data to Squirrel
   * @param value The data array to return
   */
  sendMessage(value: any) {
    if(this.debugging) {console.log("SENDING MESSAGE: ", value)};
    this.sendToSquirrel('response', value);
  }

}
