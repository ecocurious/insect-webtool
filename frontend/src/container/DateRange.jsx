import React from "react";

import { Rail, Slider, Handles, Ticks } from "react-compound-slider";
import { subDays, startOfToday, format } from "date-fns";
import { scaleTime } from "d3-scale";
import _ from "lodash";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import NavigationIcon from "@material-ui/icons/Navigation";

import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";

import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

// *******************************************************
// TICK COMPONENT
// *******************************************************
export function Tick({ tick, count, format }) {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          marginTop: 14,
          width: 1,
          height: 8,
          backgroundColor: "rgb(100,100,100)",
          left: `${tick.percent}%`
        }}
      />
      <div
        style={{
          userSelect: "none",
          position: "absolute",
          marginTop: 22,
          fontSize: 10,
          textAlign: "center",
          fontFamily: "Arial, san-serif",
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`
        }}
      >
        {format(tick.value)}
      </div>
    </div>
  );
}

Tick.propTypes = {
  tick: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired
  }).isRequired,
  count: PropTypes.number.isRequired,
  format: PropTypes.func.isRequired
};

Tick.defaultProps = {
  format: d => d
};

// *******************************************************

const sliderStyle = {
  // Give the slider some width
  position: "relative",
  width: "100%",
  height: 80
};

const railStyle = {
  position: "absolute",
  width: "100%",
  height: 10,
  marginTop: 35,
  borderRadius: 5,
  backgroundColor: "#8B9CB6"
};

/****************************************************************************/

function memoize(pairs) {
  const cache = {};
  _.forEach(pairs, pair => {
    // console.log('pair', pair);
    cache[pair[0]] = pair[1];
  });
  // console.log('cache is', cache);
  return k => _.get(cache, k, undefined);
}

/****************************************************************************/

function stripPrefixes(xs) {
  var prefix = undefined;
  _.forEach(xs, x => {
    x;
  });
}

export function Handle({ handle: { id, value, percent }, getHandleProps }) {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: "absolute",
        marginLeft: 0,
        marginRight: -20,
        marginTop: 25,
        zIndex: 2,
        width: 10,
        height: 30,
        border: 0,
        textAlign: "center",
        cursor: "col-resize",
        backgroundColor: "#2C4870",
        color: "#333"
      }}
      {...getHandleProps(id)}
    ></div>
  );
}

{
  /* <div style={{ fontFamily: 'Roboto', fontSize: 11, marginTop: -35 }}> */
}
{
  /*   {format(new Date(value), "MMM dd")} */
}
{
  /* </div> */
}

class DateRange extends React.Component {
  constructor(props) {
    super();

    const begin = props.startDate;
    const end = props.endDate;

    this.state = {
      min: begin,
      max: end,
      selectedBegin: begin,
      selectedEnd: end,
      stack: []
    };
  }

  onChange([ms1, ms2]) {
    const selectedBegin = new Date(ms1);
    const selectedEnd = new Date(ms2);

    this.props.setStartDate(selectedBegin);
    this.props.setEndDate(selectedEnd);

    this.setState({ selectedBegin, selectedEnd });
  }

  zoomIn() {
    const { selectedBegin, selectedEnd, min, max, stack } = this.state;
    if (min == selectedBegin && max == selectedEnd) {
      return;
    }
    stack.push([min, max]);
    this.setState({
      min: selectedBegin,
      max: selectedEnd,
      stack: stack
    });
  }

  zoomOut() {
    const { selectedBegin, selectedEnd, min, max, stack } = this.state;
    if (_.size(stack) == 0) {
      return;
    }

    const old = stack.pop();

    this.setState({
      min: old[0],
      max: old[1],
      stack: stack
    });
  }

  render() {
    const { min, max, selectedBegin, selectedEnd } = this.state;

    const dateTicks = scaleTime()
      .domain([min, max])
      .ticks(11)
      .map(d => +d);

    return (
      <div style={{ width: "100%" }}>
        <div>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            aria-label="add"
            onClick={() => this.zoomOut()}
          >
            <ZoomOutIcon />
            Zoom Out
          </Button>

          <Button
            variant="outlined"
            size="small"
            color="primary"
            aria-label="add"
            onClick={() => this.zoomIn()}
          >
            <ZoomInIcon />
            Zoom In
          </Button>
        </div>

        <Slider
          rootStyle={
            sliderStyle /* inline styles for the outer div. Can also use className prop. */
          }
          domain={[+min, +max]}
          // step={1000*60*60*24}
          step={1000}
          values={[+selectedBegin, +selectedEnd]}
          onChange={ms => this.onChange(ms)}
          mode={2}
        >
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>

          <Ticks values={dateTicks}>
            {({ ticks }) => {
              const n = _.size(ticks);

              const formats = [
                ["LLL yyyy", 0],
                ["LLL dd", 1],
                ["HH:mm", 2],
                [":ss", 3]
              ];

              const tickValues = _.map(ticks, tick => tick.value);

              const keepChanges = strings => {
                return _.zipWith(
                  [undefined].concat(_.initial(strings)),
                  strings,
                  (xLast, x) => (x == xLast || xLast === undefined ? null : x)
                );
              };

              const countValues = xs => {
                return _.sum(_.map(xs, x => (x ? 1 : 0)));
              };

              const sparseTicks = (tickValues, fmt) => {
                const delta = tickValues[1] - tickValues[0];
                const tickValuesExt = _.concat(
                  [tickValues[0] - delta],
                  tickValues
                );
                return _.tail(
                  keepChanges(
                    _.map(tickValuesExt, tickValue => format(tickValue, fmt))
                  )
                );
              };

              const denseTicks = (tickValues, fmt) => {
                return _.map(tickValues, tickValue => format(tickValue, fmt));
              };

              // const countTicks = fmt => countValues(sparseTicks(tickValues, fmt));

              const interleave = (arr1, arr2) =>
                _.zipWith(arr1, arr2, (x1, x2) => (_.isNull(x1) ? x2 : x1));

              const x1 = _.map(formats, f => {
                const idx = f[1];
                const fmt = f[0];

                const sparse = sparseTicks(tickValues, fmt);
                if (countValues(sparse) == 0) {
                  return [sparse, -1, idx];
                } else {
                  if (idx + 1 >= _.size(formats)) {
                    return [sparse, 0, idx];
                  } else {
                    const sparseNext = sparseTicks(
                      tickValues,
                      formats[idx + 1][0]
                    );
                    const denseNext = denseTicks(
                      tickValues,
                      formats[idx + 1][0]
                    );

                    const score = countValues(interleave(sparse, sparseNext));
                    return [interleave(sparse, denseNext), 1, score];
                  }
                }
              });

              const tickLabels = _.sortBy(x1, [x => -x[1], x => -x[2]])[0][0];

              const g = memoize(
                _.zipWith(ticks, tickLabels, (tick, label) => [
                  tick.value,
                  label
                ])
              );

              return (
                <div>
                  {ticks.map(tick => (
                    <Tick
                      key={tick.id}
                      tick={tick}
                      count={ticks.length}
                      format={g}
                    />
                  ))}
                </div>
              );
            }}
          </Ticks>

          <div
            style={
              railStyle /* Add a rail as a child.  Later we'll make it interactive. */
            }
          />
        </Slider>
      </div>
    );
  }
}

export default DateRange;
