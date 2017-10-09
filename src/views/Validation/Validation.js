import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logListRequested} from '../../actions/LogActions';
import LogListCard from '../../components/LogListCard';
import ConfigTableCard from '../../components/validation/ConfigTableCard';
import {predictionMethods} from '../../reference';
import {jobResultsRequested} from '../../actions/JobActions';

class Validation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      predictionMethod: predictionMethods[0].value,
      log: ''
    };
  }

  onChangeLog(logName) {
    this.setState({log: logName});
    this.props.onRequestJobResults(logName);
  }

  componentDidMount() {
    if (this.props.logNames.length === 0) {
      return this.props.onRequestLogList(true);
    } else {
      return this.props.onRequestLogList(false);
    }
  }

  onChangeType(type) {
    this.setState({predictionMethod: type});
  }

  render() {
    return (
      <div className="md-grid">
        <div className="md-cell md-cell--12">
          <LogListCard logNames={this.props.logNames} fetchState={this.props.fetchState}
                       visibleLogName={this.state.log}
                       selectChange={this.onChangeLog.bind(this)}/>
        </div>
        <div className="md-cell md-cell--12">
          <ConfigTableCard jobs={this.props.jobs}
                           selectChange={this.onChangeType.bind(this)}/>
        </div>
      </div>
    );
  }
}

Validation.propTypes = {
  fetchState: PropTypes.shape({
    inFlight: PropTypes.bool.isRequired,
    error: PropTypes.any
  }).isRequired,
  logNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onRequestLogList: PropTypes.func.isRequired,
  onRequestJobResults: PropTypes.func.isRequired,
  jobs: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    run: PropTypes.string.isRequired,
    log: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    prefix: PropTypes.number.isRequired,
    rule: PropTypes.string,
    threshold: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string.isRequired,
    result: PropTypes.object.isRequired
  })).isRequired,
};

const mapStateToProps = (state) => ({
  jobs: state.jobs.jobs,
  logNames: state.logs.logs.map((log) => log.name),
  fetchState: state.jobs.fetchState
});

const mapDispatchToProps = (dispatch) => ({
  onRequestLogList: (changeVisible) => dispatch(logListRequested({changeVisible, requestInfo: false})),
  onRequestJobResults: (logName) => dispatch(jobResultsRequested(logName))
});

export default connect(mapStateToProps, mapDispatchToProps)(Validation);
