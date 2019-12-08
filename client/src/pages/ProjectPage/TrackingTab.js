import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function TrackingTab(props) {
  function allDataPointsForNode() {
    function collect(root, data) {
      for (var i = 0; i < root.reports.length; i++) {
        data.splice(data.length, 0, {
          date: root.reports[i].date,
          progress: root.reports[i].progress,
          remaining: root.reports[i].remaining
        });
      }
      for (var i = 0; i < root.children.length; i++) {
        data = collect(root.children[i], Array.from(data));
      }
      return data;
    }

    return collect(props.selectedTask, []);
  }

  var data = Array.from(allDataPointsForNode());

  data = squash(data);
  data = sumEachProgressValue(data);

  const progress = data.map(datapoint => {
    return [datapoint.datemillis, datapoint.progress];
  });

  const options = {
    chart: {
      type: "area"
    },
    title: {
      text: null
    },
    xAxis: {
      type: "datetime"
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
        name: "Remaining",
        data: remaining
      },
      {
        name: "Progress",
        data: progress
      }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

function squash(datapoints) {
  var index = 0;
  while (index < datapoints.length - 1) {
    var curr = datapoints[index];
    var next = datapoints[index + 1];
    if (curr.datemillis == next.datemillis) {
      curr.progress += next.progress;
      curr.remaining += next.remaining;
      datapoints.splice(index + 1, 1);
      index -= 1;
    }
    index += 1;
  }
}

// make each datapoint's progress the sum of all previous progress points
function sumEachProgressValue(data) {
  for (var i = 1; i < data.length; i++) {
    data[i].progress += data[i - 1].progress;
  }
  return data;
}

export default TrackingTab;
