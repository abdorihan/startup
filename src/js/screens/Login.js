import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMessage } from 'grommet/utils/Intl';

import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import LoginForm from 'grommet/components/LoginForm';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import StandardsConnectivityIcon from 'grommet/components/icons/base/StandardsConnectivity';

import { login } from '../actions/session';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';
import Validator from '../utils/validator';

class Login extends Component {
    constructor (props, context) {
        super(props, context);
        this._onSubmit = this._onSubmit.bind(this);
        this.state = {
            error: false
        };
    }

    componentWillReceiveProps (props) {
        this.setState({ error: props.session.error });
    }

    componentDidMount () {
        pageLoaded('Login');
        this.props.dispatch(navEnable(false));
    }

    componentWillUnmount () {
        this.props.dispatch(navEnable(true));
    }

    _onSubmit (fields) {
        const { dispatch } = this.props;
        const { router } = this.context;
        const err = Validator.error(fields.username, [Validator.email]) || Validator.error(fields.password, [Validator.required]);
        if (!err) {
            dispatch(login(fields.username, fields.password, () => (
                router.history.push('/dashboard')
            )));
        } else {
            this.setState({ error: err });
        }
    }

    render() {
        const { intl } = this.context;

        return (
            <Split flex='left' separator={true}>

                <Article>
                    <Section
                        full={true}
                        colorIndex='brand'
                        texture='url(img/splash.png)'
                        pad='large'
                        justify='center'
                        align='center'
                    >
                        <Heading tag='h1' strong={true}>{getMessage(intl, 'system_name')}</Heading>
                        <Paragraph align='center' size='large'>
                            {getMessage(intl, 'system_logo')}
                        </Paragraph>
                    </Section>
                </Article>

                <Sidebar justify='between' align='center' pad='none' size='large'>
                    <span />
                    <LoginForm
                        align='start'
                        logo={<StandardsConnectivityIcon className='logo' colorIndex='brand' size='xlarge' />}
                        title={getMessage(intl, 'login')}
                        onSubmit={this._onSubmit}
                        errors={[this.state.error]}
                        usernameType='email'
                    />
                    <Footer
                        direction='row'
                        size='small'
                        pad={{ horizontal: 'medium', vertical: 'small' }}
                    >
                        <span className='secondary'>&copy; 2018 <a href='https://www.linkedin.com/in/abduladimrehan'>abdorihan</a></span>
                    </Footer>
                </Sidebar>

            </Split>
        );
    }
}

Login.defaultProps = {
    session: {
        error: undefined
    }
};

Login.propTypes = {
    dispatch: PropTypes.func.isRequired,
    session: PropTypes.shape({
        error: PropTypes.string
    })
};

Login.contextTypes = {
    router: PropTypes.object.isRequired,
    intl: PropTypes.object
};

const select = state => ({
    session: state.session
});

export default connect(select)(Login);
