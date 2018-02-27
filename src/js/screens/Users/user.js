import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Article from 'grommet/components/Article';
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Notification from 'grommet/components/Notification';
import { getMessage } from 'grommet/utils/Intl';
import Button from 'grommet/components/Button';
import Title from 'grommet/components/Title';
import ElementViewer from '../../components/ElementViewer';
import Loading from '../../components/Loading';
import Toast from 'grommet/components/Toast';

import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';

import { pageLoaded, defaultMaleProfilePic, defaultFemaleProfilePic } from '../utils';
import _ from 'lodash';
import Validator from '../../utils/validator';
import access from '../../utils/access';

import { getUser, editUser, deleteUser } from '../../actions/users';

class User extends Component {
    constructor(props, context) {
        super(props, context);
        this.intl = this.context.intl;
        this.state = {
            alert: false,
            message: '',
            loading: true,
            ableToEdit: access(this.context.store.getState().session, ['edit_emp']),
            ableToDelete: access(this.context.store.getState().session, ['delete_emp'])
        };
    }

    componentWillReceiveProps (props) {
        if ((props.error && props.error.code === 404) || _.isEmpty(props.element)) {
            props.history.goBack();
            return;
        }
        if ((props.error && props.error.message) || props.updated) {
            if (props.updated && props.idColumn) {
                const id = this.props.match.params.id;
                const index = props.data.findIndex((elem) => String(elem[props.idColumn]) === id);
                if (index >= 0) props.data[index] = props.element;
            }
            this.setState({ alert: true, loading: false });
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ alert: false });
                }
            }, 4000);
        }
        if (props.deleted) {
            // props.data.splice(0); // forces users to be loaded again
            if (props.idColumn) {
                const id = this.props.match.params.id;
                const index = props.data.findIndex((elem) => String(elem[props.idColumn]) === id);
                if (index >= 0) props.data.splice(index, 1);
            }
            this.setState({ loading: false });
            props.history.goBack();
        }
        if (props.loading !== this.state.loading) {
            this.setState({ loading: props.loading });
        }
    }

    componentDidMount() {
        this._isMounted = true;
        pageLoaded('User');
        const id = this.props.match.params.id;
        this.props.dispatch(getUser(id)); // load user
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    onEdit (element) {
        this.setState({ loading: true });
        const id = this.props.match.params.id;
        this.props.dispatch(editUser(element, id));
    }

    onDelete () {
        this.setState({ loading: true });
        const id = this.props.match.params.id;
        this.props.dispatch(deleteUser(id));
    }

    render() {
        const { updated, error, element } = this.props;
        let message;
        if (error) {
            message = (
                <Notification
                    status='critical'
                    size='large'
                    state={error.message}
                    message={getMessage(this.intl, 'error')}
                />
            );
        }
        if (updated) {
            message = (
                <Toast status='ok'>{getMessage(this.intl, 'user_updated')}</Toast>
            );
        }
        const rows = [
            {
                cols: [
                    {
                        name: getMessage(this.intl, 'image'),
                        accessor: 'image',
                        type: ElementViewer.image,
                        xs: 12, sm: 6, md: 3, lg: 3,
                        value: (val, elem) => val || (elem.emp_gender === 0 ? defaultFemaleProfilePic : defaultMaleProfilePic)
                    },
                    { rows: [
                        {
                            cols: [
                                { name: getMessage(this.intl, 'name'), accessor: 'emp_name', validators: [Validator.required] }
                            ]
                        },
                        {
                            cols: [
                                { name: getMessage(this.intl, 'email'), accessor: 'emp_email', validators: [Validator.email] }
                            ]
                        },
                        {
                            cols: [
                                { name: getMessage(this.intl, 'phone'), accessor: 'emp_phone', validators: [Validator.phone] }
                            ]
                        }
                    ] }
                ]
            },
            {
                cols: [
                    {
                        name: getMessage(this.intl, 'gender'),
                        validators: [Validator.required],
                        accessor: 'emp_gender',
                        type: ElementViewer.select,
                        options: [{ id: 1, value: getMessage(this.intl, 'male') }, { id: 0, value: getMessage(this.intl, 'female') }],
                        value: (val) => (val === 0) ? getMessage(this.intl, 'female') : getMessage(this.intl, 'male')
                    },
                    { name: getMessage(this.intl, 'address'), accessor: 'emp_address' }
                ]
            }
        ];

        return (
            <Article primary>
                <Header
                    style={{ backgroundColor: '#eee' }}
                    direction='row'
                    justify='between'
                    size='medium'
                    pad={{ horizontal: 'medium', between: 'small' }}>
                    <Anchor path='/users'>
                        <LinkPrevious a11yTitle='Back' />
                    </Anchor>
                    <Title >{element.name}</Title>
                    <Button plain />
                </Header>
                {this.state.alert ? message : ''}
                <Loading show={this.state.loading} />
                <ElementViewer
                    onSave={this.state.ableToEdit ? this.onEdit.bind(this) : undefined}
                    onDelete={this.state.ableToDelete ? this.onDelete.bind(this) : undefined}
                    rows={rows}
                    element={element}
                    title={getMessage(this.intl, 'user_details')} />
            </Article>
        );
    }
}

User.defaultProps = {
    error: undefined,
    updated: false,
    deleted: false,
    element: {},
    idColumn: '',
    loading: true
};

User.propTypes = {
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
    updated: PropTypes.bool,
    deleted: PropTypes.bool,
    match: PropTypes.object.isRequired,
    element: PropTypes.object,
    history: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    idColumn: PropTypes.string,
    loading: PropTypes.bool
};

User.contextTypes = {
    intl: PropTypes.object,
    store: PropTypes.object
};

const select = state => ({ ...state.users });

export default connect(select)(User);
