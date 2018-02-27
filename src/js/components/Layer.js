import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CloseIcon from 'grommet/components/icons/base/Close';
import Button from 'grommet/components/Button';
import Animate from 'grommet/components/Animate';

class Layer extends Component {
    constructor(props) {
        super(props);

        this.closeLayer = this.closeLayer.bind(this);
        this.state = {
            show: this.props.show
        };
    }

    closeLayer () {
        if (typeof this.props.onClose === 'function') this.props.onClose();
        this.setState({ show: false });
    }

    componentWillReceiveProps (nextprops) {
        this.setState({ show: nextprops.show });
    }

    render() {
        return (
            <Animate visible={this.state.show}
                className='page-layer-container'
                style={this.state.show ? { visibility: 'visible' } : { visibility: 'hidden' }}
                enter={{ animation: 'slide-right', duration: 1000, delay: 0 }}
                leave={{ animation: 'slide-right', duration: 1000, delay: 0 }}
                keep>
                <Button plain icon={<CloseIcon size='medium' />} onClick={this.closeLayer} className='close-button' />
                <div className='page-layer'>
                    { this.props.children }
                </div>
            </Animate>
        );
    }
}

Layer.propTypes = {
    children: PropTypes.element.isRequired,
    show: PropTypes.bool,
    onClose: PropTypes.func
};

Layer.defaultProps = {
    show: false,
    action: undefined,
    dispatch: undefined,
    onClose: undefined
};

export default Layer;
