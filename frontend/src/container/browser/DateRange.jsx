import React from "react";

import { Slider, Handles, Ticks } from "react-compound-slider";
import { format } from "date-fns";
import { scaleTime } from "d3-scale";
import _ from "lodash";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import ButtonGroup from '@material-ui/core/ButtonGroup';

import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import SelectAllIcon from '@material-ui/icons/SelectAll';


import Grid from "@material-ui/core/Grid";

// *******************************************************
// TIME TICK COMPONENT
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


export function DataPointTick({ tick }) {
  return (
      <div
        style={{
          position: "absolute",
          top: 36,
          width: 8,
          height: 8,
          backgroundColor: "rgb(0, 255, 219)",
          borderRadius: "50%",
          left: `${tick.percent}%`
        }}
      />
  );
}

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

    this.state = {
      rangeStartHint: props.startDate,
      rangeStopHint: props.endDate
    };
  }

  onChange([ms1, ms2]) {
    // this.props.setStartDate(new Date(ms1));
    // this.props.setEndDate(new Date(ms2));

    const startDate = new Date(ms1);
    const endDate = new Date(ms2);

    const search = this.props.search;

    const delta = (x, y) => Math.abs(x-y);

    if (delta(+this.props.startDate, +startDate) > 2000 || delta(+this.props.endDate, +endDate) > 2000) {
        this.props.onSearchUpdate({...search, ...{afterId: undefined}, ...{startDate, endDate}});
    }

    // if (this.props.endDate != endDate) {
    //     // console.log('this.props.endDate != endDate', this.props.endDate, endDate);
    // }
  }

  selectFullRange() {
    const search = this.props.search;
    const { rangeStartHint, rangeStopHint } = this.state;

    const startDate = new Date(Math.min(+rangeStartHint, +this.props.startDate));
    const endDate = new Date(Math.max(+this.props.endDate, +rangeStopHint));

    this.props.onSearchUpdate({...search, ...{afterId: undefined} , ...{startDate, endDate}});
  }

  zoomToFrames() {
  }

  zoomIn() {
    this.setState({
      rangeStartHint: this.props.startDate,
      rangeStopHint: this.props.endDate,
    });
  }

  zoomOut() {
      const t1 = this.state.rangeStartHint;
      const t2 = this.state.rangeStopHint;
      const d = (+t2) - (+t1);
      const r = 0.3;
      const t1p = (+t1) - r*d;
      const t2p = (+t2) + r*d;
      this.setState({
        rangeStartHint: new Date(t1p),
        rangeStopHint: new Date(t2p)
      });
  }

  resetView() {
    const search = this.props.search;
    const startDate = new Date("2019-11-15T00:00:00");
    const endDate = new Date("2020-01-31T00:00:00");
    this.props.onSearchUpdate({...search, ...{startDate, endDate}});
  }

  render() {
    const { rangeStartHint, rangeStopHint } = this.state;

    const rangeStart = new Date(Math.min(+rangeStartHint, +this.props.startDate));
    const rangeStop = new Date(Math.max(+this.props.endDate, +rangeStopHint));

    // console.log('frames', this.props.frames);
    const frameTimestamps = this.props.frames.map((frame) => +(new Date(frame.timestamp)));

    // console.log("frameTimestamps", frameTimestamps);


    const dateTicks = scaleTime()
      .domain([rangeStart, rangeStop])
      .ticks(11)
      .map(d => +d);

    return (
      <Grid container justify="flex-start" spacing={2}>
        <Grid item>
          <ButtonGroup>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => this.resetView()}
              >
                Reset
              </Button>

              <Button
                variant="outlined"
                size="small"
                color="primary"
                aria-label="add"
                onClick={() => this.zoomOut()}
              >
                <ZoomOutIcon />
              </Button>

              <Button
                variant="outlined"
                size="small"
                color="primary"
                aria-label="add"
                onClick={() => this.zoomIn()}
              >
                <ZoomInIcon />
              </Button>

              <Button
                variant="outlined"
                size="small"
                color="primary"
                aria-label="add"
                onClick={() => this.props.onZoomToFrames()}
              >
                <SelectAllIcon />
              </Button>

              <Button
                variant="outlined"
                size="small"
                color="primary"
                aria-label="add"
                onClick={() => this.selectFullRange()}
              >
                <ZoomOutMapIcon />
              </Button>
          </ButtonGroup>
        </Grid>

        <Grid item xs>

        <Slider
          rootStyle={
            sliderStyle /* inline styles for the outer div. Can also use className prop. */
          }
          domain={[+rangeStart, +rangeStop]}
          // step={1000*60*60*24}
          step={1000}
          values={[+(this.props.startDate), +(this.props.endDate)]}
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

          <Ticks values={frameTimestamps}>
          {({ticks}) => {
              return (
                  <div>
                  {ticks.map((tick, idx) =>
                      (
                      <DataPointTick
                          key={"data-point-tick" + idx}
                          tick={tick}
                      />
                      )
                  )}
                  </div>
              )
            }
          }
          </Ticks>

        </Slider>

        </Grid>

      </Grid>
    );
  }
}

export default DateRange;
