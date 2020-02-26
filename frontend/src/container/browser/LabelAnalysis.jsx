import React from "react";

import {Line} from 'react-chartjs-2';
import _ from "lodash";

const LabelAnalysis = ({frames, labels}) => {
    const labelCounts = _.groupBy(_.flatMap(frames, (frame) => {
        const timestamp = new Date(frame.timestamp);
        const lls = _.flatMap(frame.appearances, (appearance) => (
            _.map(appearance.appearanceLabels, (appearanceLabel) =>
                ({labelId: appearanceLabel.label.id, timestamp})
            )
        ));
        return _.map(_.countBy(lls, 'labelId'), (count, labelId) => ({timestamp, labelId, count}));
    }), 'labelId');


    const getPlotStyle = (labelId) => {
        const lookup = _.fromPairs(_.map(_.sortBy(_.keys(labelCounts)), (labelId, ii) => [labelId, ii]));
        const palette = [
            {
                borderColor: 'rgba(0, 63, 92, 1.0)',
                backgroundColor: 'rgba(0, 63, 92, 0.4)'
            },
            {
                borderColor: 'rgba(188, 80, 144, 1.0)',
                backgroundColor: 'rgba(188, 80, 144, 0.4)'
            },
            {
                borderColor: 'rgba(88, 80, 141, 1.0)',
                backgroundColor: 'rgba(88, 80, 141, 0.4)'
            },
            {
                borderColor: 'rgba(255, 99, 97, 1.0)',
                backgroundColor: 'rgba(255, 99, 97, 0.4)'
            },
            {
                borderColor: 'rgba(255, 166, 0, 1.0)',
                backgroundColor: 'rgba(255, 166, 0, 0.4)'
            }
        ];
        const i = (_.get(lookup,labelId,0)) % _.size(palette);
        return palette[i];
    }

    const datasets = _.map(labelCounts, (counts, labelId) => {
        const { backgroundColor, borderColor } = getPlotStyle(labelId);
        // console.log('plotStyle', plotStyle);
        const dataset = {
          label: _.get(labels.byKey, [labelId,'name'], labelId),
          data: _.map(counts, ({timestamp, count}) => ({x: timestamp, y: count})),

          lineTension: 0.1,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',

          // pointBorderColor: 'rgba(75,192,192,1)',
          // pointBackgroundColor: '#fff',
          // pointBorderWidth: 1,
          // pointHoverRadius: 5,
          // pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          // pointHoverBorderColor: 'rgba(220,220,220,1)',
          // pointHoverBorderWidth: 2,
          // pointRadius: 3,
          // pointHitRadius: 10,

          backgroundColor,
          borderColor,
        };
        return dataset;
    });
    console.log('datasets', datasets);


    const options = {
        scales: {
            xAxes: [{
                    type: 'time',
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
            }]
        }
    };

    const data = { datasets };
    return (<Line data={data} options={options}/>
);
}

export default LabelAnalysis;
