import React from 'react';
import PropTypes from 'prop-types';

/**
 * React class component to delayed render it's children
 * 
 * @inner
 * @memberof SharedComponents
 * 
 * @component
 * @namespace Delayed
 *
 * @property {number} waitBeforeShow - wait time (in milliseconds) before
 * start rendering of component
 * @return {component} - Component which delayed renders it's children
 * 
 * @example
 *  <Delayed waitBeforeShow={0.005}>
      <CKEditor
        {...props}
      />
    </Delayed>
 */
class Delayed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hidden: true };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ hidden: false });
    }, this.props.waitBeforeShow);
  }

  render() {
    return this.state.hidden ? '' : this.props.children;
  }
}

Delayed.propTypes = {
  waitBeforeShow: PropTypes.number.isRequired,
  children: PropTypes.any
};

export default Delayed;
