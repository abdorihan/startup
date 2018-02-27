import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Notification from 'grommet/components/Notification';
import { getMessage } from 'grommet/utils/Intl';
import Button from 'grommet/components/Button';
import Toast from 'grommet/components/Toast';

// icons
import UserAddIcon from 'grommet/components/icons/base/UserAdd';
import UserIcon from 'grommet/components/icons/base/User';
import RefreshIcon from 'grommet/components/icons/base/Refresh';

import NavControl from '../../components/NavControl';
import Table from '../../components/Table';
import Loading from '../../components/Loading';
import Layer from '../../components/Layer';
import ElementViewer from '../../components/ElementViewer';
import { pageLoaded, defaultMaleProfilePic, defaultFemaleProfilePic } from '../utils';
import Validator from '../../utils/validator';
import access from '../../utils/access';

import { loadUsers, addNewUser } from '../../actions/users';

const defaultElement = {};

class Users extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            layer: false,
            element: defaultElement,
            laoding: true,
            data: props.data,
            ableToAdd: access(this.context.store.getState().session, ['add_emp'])
        };
        this.intl = this.context.intl;
        this.addElement = this.addElement.bind(this);
        this.selectElement = this.selectElement.bind(this);
        this.load = this.load.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.columns = [
            {
                Header: getMessage(this.intl, 'name'),
                accessor: 'emp_name'
            },
            {
                Header: getMessage(this.intl, 'email'),
                accessor: 'emp_email'
            },
            {
                Header: getMessage(this.intl, 'phone'),
                accessor: 'emp_phone'
            },
            {
                id: 'id',
                Header: getMessage(this.intl, 'gender'),
                accessor: d => d.emp_gender === 0 ? getMessage(this.intl, 'female') : getMessage(this.intl, 'male')
            }
        ];
    }

    componentWillReceiveProps (props) {
        if (props.added || (props.error && props.error.message)) {
            if (props.added) props.data.push(props.element);
            this.setState({ layer: false, alert: true, loading: false, data: [...props.data] });
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ alert: false });
                }
            }, 4000);
            return;
        }
        this.setState({ layer: false, loading: props.loading, data: props.data });
    }
    load () {
        this.setState({ loading: true });
        this.props.dispatch(loadUsers());
    }

    componentDidMount () {
        this._isMounted = true;
        pageLoaded('Users');
        if (!this.props.data.length) { // don't allways load data
            this.load();
        }
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    selectElement (row) {
        this.props.history.push(`user/${row.original.emp_id}`);
    }

    addElement() {
        this.setState({ layer: true });
    }

    onAdd (element) {
        this.setState({ loading: true });
        this.props.dispatch(addNewUser(element));
    }

    render() {
        const { added, error } = this.props;
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
        if (added) {
            message = <Toast status='ok'>{getMessage(this.intl, 'user_added')}</Toast>;
        }

        return (
            <Article primary={true}>
                <Header
                    style={{ backgroundColor: '#eee' }}
                    direction='row'
                    justify='between'
                    size='large'
                    pad={{ horizontal: 'medium', between: 'small' }}>
                    <NavControl name={getMessage(this.intl, 'users')} icon={<UserIcon />} />
                    <div>
                        <Button icon={<RefreshIcon />} onClick={this.load} />
                        {' '}
                        {this.state.ableToAdd
                            ? <Button icon={<UserAddIcon />}
                                label={getMessage(this.intl, 'new')}
                                onClick={this.addElement}
                                primary={true} />
                            : ''
                        }
                    </div>
                </Header>
                <Loading show={this.state.loading} />
                {this.state.layer
                    ? <Layer onClose={() => this.setState({ layer: false })} show={this.state.layer}>
                        <ElementViewer onSave={this.onAdd} title={getMessage(this.intl, 'add_new_user')} new element={this.state.element} rows={rows} />
                    </Layer>
                    : ''
                }
                {this.state.alert ? message : ''}
                <Table data={this.state.data} columns={this.columns} onClick={this.selectElement} />
            </Article>
        );
    }
}

Users.defaultProps = {
    error: undefined,
    added: false,
    data: [],
    loading: true,
    element: undefined
};

Users.propTypes = {
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.object),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    added: PropTypes.bool,
    loading: PropTypes.bool,
    element: PropTypes.object
};

Users.contextTypes = {
    intl: PropTypes.object,
    store: PropTypes.object
};

const select = state => ({ ...state.users });

export default connect(select)(Users);
