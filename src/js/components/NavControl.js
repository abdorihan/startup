// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMessage } from 'grommet/utils/Intl';

import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Title from 'grommet/components/Title';
import MenuIcon from 'grommet/components/icons/base/Menu';

import { navActivate } from '../actions/nav';

class NavControl extends Component {
    render () {
        const { name, nav: { active } } = this.props;
        const { intl } = this.context;

        let result;
        let i;

        if (this.props.icon) {
            i = this.props.icon;
        }
        const title = <Title>{i}{name || getMessage(intl, 'system_name')}</Title>;
        if (!active) {
            result = (
                <Button onClick={() => this.props.dispatch(navActivate(true))}>
                    <Box
                        direction='row'
                        responsive={false}
                        pad={{ between: 'small' }}
                    >
                        <MenuIcon />
                        {title}
                    </Box>
                </Button>
            );
        } else {
            result = title;
        }
        return result;
    }
}

NavControl.defaultProps = {
    name: undefined,
    nav: {
        active: true, // start with nav active
        enabled: true, // start with nav disabled
        responsive: 'multiple'
    },
    icon: undefined
};
NavControl.contextTypes = {
    intl: PropTypes.object
};

NavControl.propTypes = {
    dispatch: PropTypes.func.isRequired,
    name: PropTypes.string,
    nav: PropTypes.object,
    icon: PropTypes.any
};

const select = state => ({
    nav: state.nav
});

export default connect(select)(NavControl);
