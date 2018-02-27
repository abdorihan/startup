import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loading from 'react-loading-components';

class LoadingLayer extends Component {
    render() {
        return (
            <div>{this.props.show ? <div className='loading-layer'>
                <div><Loading type='bars' /></div>
            </div> : ''}</div>
        );
    }
}

LoadingLayer.propTypes = {
    show: PropTypes.bool
};

LoadingLayer.defaultProps = {
    show: false
};

export default LoadingLayer;
