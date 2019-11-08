import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

function TrackingTab(props) {

    var data = props.allDataPointsForNode(props.selected);

    data.map(datapoint => {
        datapoint.datemillis = dateInMillisFromString(datapoint.date);
    })
    data.sort((a,b) => {
        return a.datemillis - b.datemillis;
    });

    data = squash(data);

    const remaining = data.map(datapoint => {
        return [datapoint.datemillis, datapoint.remaining];
    });

    const progress = data.map(datapoint => {
        return [datapoint.datemillis, datapoint.progress];
    })

    const options = {
        chart: {
            type: 'area'
        },
        title: {
            text: null
        },
        xAxis: {
            type: "datetime",
        },
        yAxis: {
            title: {
                text: "Days Effort"
            }
        },
        plotOptions: {
            area: {
                stacking: "normal"
            }
        },
        series: [
            {
                name: 'Remaining',
                data: remaining, 
            },
            {
                name: 'Progress', 
                data: progress,
            },
        ]
    }

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    );
}

function dateInMillisFromString(dateStr) {
    const components = dateStr.split("-");
    const year = parseInt(components[0])
    const month = parseInt(components[1]) - 1;
    const day = parseInt(components[2]);
    return (new Date(year, month, day)).getTime();
}

function squash(datapoints) {
    var index = 0;
    while (index < datapoints.length - 1) {
        var curr = datapoints[index];
        var next = datapoints[index+1];
        if (curr.datemillis == next.datemillis) {
            curr.progress += next.progress;
            curr.remaining += next.remaining;
            datapoints.splice(index + 1, 1);
            index -= 1;
        }
        index += 1;
    }
    return datapoints;
}

export default TrackingTab;