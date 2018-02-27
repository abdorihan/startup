import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Title from 'grommet/components/Title';
import Menu from 'grommet/components/Menu';
import Button from 'grommet/components/Button';
import CloseIcon from 'grommet/components/icons/base/Close';
import StandardsConnectivityIcon from 'grommet/components/icons/base/StandardsConnectivity';
import Anchor from 'grommet/components/Anchor';
import { getMessage } from 'grommet/utils/Intl';

import SessionMenu from './SessionMenu';
import { navActivate } from '../actions/nav';

class NavSidebar extends Component {
    constructor () {
        super();
        this._onClose = this._onClose.bind(this);
    }

    _onClose () {
        this.props.dispatch(navActivate(false));
    }

    render () {
        const { nav: { items } } = this.props;
        const { intl } = this.context;

        const prevs = this.context.store.getState().session.prevs;
        let links = [];
        if (prevs) {
            links = items.map(page => {
                let flag = true;
                if (page.prevs) {
                    for (let i = 0; i < page.prevs.length; i++) {
                        if (prevs.indexOf(page.prevs[i]) === -1) {
                            flag = false;
                            break;
                        }
                    }
                }
                return (
                    flag ? <Anchor key={page.label} path={page.path} label={page.label} /> : ''
                );
            });
        }
        return (
            <Sidebar colorIndex='neutral-3' fixed={true}>
                <Header size='large' justify='between' pad={{ horizontal: 'medium' }}>
                    <Title onClick={this._onClose} a11yTitle='Close Menu'>
                        <StandardsConnectivityIcon />
                        <span>{getMessage(intl, 'system_name')}</span>
                    </Title>
                    <Button
                        icon={<CloseIcon />}
                        onClick={this._onClose}
                        plain={true}
                        a11yTitle='Close Menu'
                    />
                </Header>
                <Menu fill={true} primary={true}>
                    {links}
                </Menu>
                <Footer pad={{ horizontal: 'medium', vertical: 'small' }}>
                    <SessionMenu dropAlign={{ bottom: 'bottom' }} />
                </Footer>
            </Sidebar>
        );
    }
}

NavSidebar.defaultProps = {
    nav: {
        active: true, // start with nav active
        enabled: true, // start with nav disabled
        responsive: 'multiple'
    }
};

NavSidebar.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
            path: PropTypes.string,
            label: PropTypes.string
        }))
    })
};

NavSidebar.contextTypes = {
    intl: PropTypes.object,
    store: PropTypes.object
};

const select = state => ({
    nav: state.nav
});

export default connect(select)(NavSidebar);
