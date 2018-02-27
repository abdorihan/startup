import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Grid, Row, Col } from 'react-styled-flexboxgrid';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import NumberInput from 'grommet/components/NumberInput';
import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import Select from 'grommet/components/Select';
import Image from 'grommet/components/Image';
import Dropzone from 'react-dropzone';
import Layer from 'grommet/components/Layer';
import Paragraph from 'grommet/components/Paragraph';

// icons
import EditIcon from 'grommet/components/icons/base/Edit';
import CheckmarkIcon from 'grommet/components/icons/base/Checkmark';
import CloseIcon from 'grommet/components/icons/base/Close';
import TrashIcon from 'grommet/components/icons/base/Trash';

import { getMessage } from 'grommet/utils/Intl';
import _ from 'lodash';
import Validator from '../utils/validator';


class ElementViewer extends Component {
    static get text () { return 1; }
    static get number () { return 2; }
    static get select () { return 3; }
    static get image () { return 4; }

    constructor (props, context) {
        super(props, context);

        this.intl = this.context.intl;
        this.edit = this.edit.bind(this);
        this.onReset = this.onReset.bind(this);
        this.confirm = this.confirm.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);

        this.state = {
            edit: props.new,
            element: { ...props.element },
            errors: {}
        };
    }

    componentWillReceiveProps (props) {
        this.setState({ element: { ...props.element } });
    }

    onReset () {
        this.setState({ element: { ...this.props.element } });
        this.edit(); // stop editing
    }

    onSubmit (e) {
        e.preventDefault();
        const keys = Object.keys(this.state.errors);
        const err = keys.some(key => {
            return this.state.errors[key] !== false;
        });
        if (!err) {
            this.props.onSave(this.state.element);
            this.edit();
        }
    }

    onDelete () {
        if (typeof this.props.onDelete === 'function') {
            this.props.onDelete();
            this.confirm();
        }
    }

    onDrop ({ accessor }, acceptedFiles) {
        if (acceptedFiles[0]) {
            const element = this.state.element;
            _.set(element, accessor, acceptedFiles[0]);
            this.setState({ element, pendingAvatar: true, rejectedAvatar: false });
        } else {
            this.setState({ rejectedAvatar: true });
        }
    }

    confirm () {
        this.setState({ confirmDelete: !this.state.confirmDelete });
    }

    resetAvatar (accessor, e) {
        e.stopPropagation();
        try {
            const element = this.state.element;
            window.URL.revokeObjectURL(_.get(element, accessor).preview);
            _.set(element, accessor, _.get(this.props.element, accessor));
            this.setState({ pendingAvatar: false, element });
        }catch (e){} //eslint-disable-line
    }

    confirmAvatar (e) {
        e.stopPropagation();
        this.setState({ pendingAvatar: false });
    }

    edit () {
        this.setState({ edit: !this.state.edit });
    }

    updateField ({ accessor, col }, { target }) {
        const element = this.state.element;
        _.set(element, accessor, target.value);
        this.state.errors[accessor] = Validator.error(target.value, col.validators);
        this.setState({ element });
    }

    updateSelect ({ accessor, col }, val) {
        const element = this.state.element;
        _.set(element, accessor, val.value.id);
        this.state.errors[accessor] = Validator.error(val, col.validators);
        this.setState({ element });
    }

    combiner (name, accessor, row, col) {
        const element = this.state.element;
        let val = _.get(element, accessor);
        if (!val && val !== 0) val = '';
        if (typeof col.value === 'function') {
            val = col.value(val, element);
        }
        this.state.errors[accessor] = Validator.error(val, col.validators);
        if (this.state.edit && col.type && col.type === ElementViewer.select) {
            return this.selectElement(val, name, accessor, col);
        } else if (this.state.edit && col.type && col.type === ElementViewer.number) {
            return this.numberElement(val, name, accessor, col);
        } else if (col.type && col.type === ElementViewer.image) {
            return this.imageElement(val, name, accessor);
        }
        return this.element(val, name, accessor, row, col);
    }

    imageElement (val, name, accessor) {
        return (
            this.state.edit
                ? <Dropzone
                    accept='image/png,image/jpg,image/jpeg'
                    multiple={false}
                    name={accessor}
                    onDrop={this.onDrop.bind(this, { name, accessor })}
                    maxSize={500000}
                    className='avatar-container'>
                    <FormField><Image src={val.preview || val} full size='small' fit='contain' alt={name} /></FormField>
                    { this.state.pendingAvatar ? '' : <div className='overlay'><p>{getMessage(this.intl, 'click_to_upload')}</p></div>}
                    {
                        (this.state.rejectedAvatar)
                            ? <div className='avatar-confirmation'>
                                <p>{getMessage(this.intl, 'rejected_image')}</p>
                            </div> : ''
                    }
                    {
                        (this.state.pendingAvatar)
                            ? <div className='avatar-confirmation'>
                                <Button icon={<CheckmarkIcon />}
                                    onClick={this.confirmAvatar.bind(this)}
                                    primary={false}
                                    secondary={false}
                                    accent={false}
                                    className='accept'
                                    critical={false}
                                    plain={false} />
                                <Button icon={<CloseIcon />}
                                    onClick={this.resetAvatar.bind(this, accessor)}
                                    primary={false}
                                    secondary={false}
                                    accent={false}
                                    className='cancel'
                                    critical={false}
                                    plain={false} />
                            </div> : ''
                    }
                </Dropzone>
                : <div className='avatar-container'><FormField><Image src={val.preview || val} full size='small' fit='contain' alt={name} /></FormField></div>
        );
    }

    selectElement (val, name, accessor, col) {
        return (
            <FormField
                error={this.state.errors[accessor]}
                label={name}>
                <Select
                    name={accessor}
                    value={String(val)}
                    options={col.options}
                    onChange={this.updateSelect.bind(this, { name, accessor, col })} />

            </FormField>
        );
    }

    numberElement (val, name, accessor, col) {
        return (
            <FormField
                error={this.state.errors[accessor]}
                label={name}>
                <NumberInput
                    max={col.max}
                    min={col.min}
                    name={accessor}
                    value={String(val)}
                    onChange={this.updateField.bind(this, { name, accessor, col })} />

            </FormField>
        );
    }

    element (val, name, accessor, row, col) {
        if (!col.validators || col.validators.length === 0) {
            this.state.errors[accessor] = false;
        }
        return (
            <FormField
                error={this.state.errors[accessor]}
                label={name}>
                <TextInput
                    disabled={!this.state.edit}
                    name={accessor}
                    value={String(val)}
                    onDOMChange={this.updateField.bind(this, { name, accessor, col })} />

            </FormField>
        );
    }

    rows (rows) {
        return rows.map((row, index) => {
            const rowArr = [];
            if (row && row.cols && row.cols.length > 0) {
                for (let i = 0; i < row.cols.length; i++) {
                    if (_.isArray(row.cols[i].rows)) {
                        rowArr.push(
                            <Col key={i} xs={row.cols[i].xs || true} sm={row.cols[i].sm || true} md={row.cols[i].md || true} lg={row.cols[i].lg || true}>
                                {this.rows(row.cols[i].rows)}
                            </Col>
                        );
                    } else {
                        rowArr.push(
                            <Col key={i} xs={row.cols[i].xs || true} sm={row.cols[i].sm || true} md={row.cols[i].md || true} lg={row.cols[i].lg || true}>
                                {this.combiner(row.cols[i].name, row.cols[i].accessor, row, row.cols[i])}
                            </Col>
                        );
                    }
                }
            }
            return <Row key={index} className='row'>{rowArr}</Row>;
        });
    }

    render() {
        const { rows } = this.props;

        return (
            <Grid>
                <Row style={{ marginTop: '20px' }}>
                    <Col xs={9}>
                        <Heading strong uppercase={false} truncate={false} align='start' tag='h2'>
                            {this.props.title}
                        </Heading>
                    </Col>
                    {(this.state.edit)
                        ? ''
                        : <Col style={{ textAlign: 'right' }} xs>
                            {typeof this.props.onDelete === 'function' ? <Button className='delete' icon={<TrashIcon />} label={getMessage(this.intl, 'delete')} primary onClick={this.confirm} /> : '' }
                            {' '}
                            {this.props.new || typeof this.props.onSave !== 'function' ? '' : <Button icon={<EditIcon />} label={getMessage(this.intl, 'edit')} primary onClick={this.edit} />}
                        </Col>}
                </Row>
                <Form onSubmit={this.onSubmit} style={{ backgroundColor: (this.state.edit && !this.props.new) ? '#fdf1f1' : '' }} plain pad='medium'>
                    {this.rows(rows)}
                    {(this.state.edit)
                        ? <Row>
                            <Col xs>
                                <Button
                                    label={getMessage(this.intl, 'save')}
                                    type='submit'
                                    className='submit'
                                    primary
                                    icon={<CheckmarkIcon />}
                                    onClick={this.onSubmit} />
                                {' '}
                                {this.props.new ? '' : <Button
                                    label={getMessage(this.intl, 'cancel')}
                                    type='reset'
                                    className='reset'
                                    primary
                                    icon={<CloseIcon />}
                                    onClick={this.onReset} />}
                            </Col>
                        </Row>
                        : ''
                    }
                </Form>
                <Layer hidden={!this.state.confirmDelete} closer overlayClose onClose={this.confirm}>
                    <Heading margin='small' strong tag='h2'>{getMessage(this.intl, 'confirm_delete')}</Heading>
                    <Paragraph margin='small' size='large'>{getMessage(this.intl, 'confirm_delete_message')}</Paragraph>
                    <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                        <Button
                            label={getMessage(this.intl, 'delete')}
                            type='submit'
                            className='delete'
                            primary
                            icon={<TrashIcon />}
                            onClick={this.onDelete.bind(this)} />
                        {' '}
                        <Button
                            label={getMessage(this.intl, 'cancel')}
                            type='reset'
                            className='submit'
                            primary
                            icon={<CloseIcon />}
                            onClick={this.confirm} />
                    </div>
                </Layer>
            </Grid>
        );
    }
}

ElementViewer.defaultProps = {
    element: {},
    rows: [],
    onDelete: undefined,
    onSave: undefined,
    new: false
};

ElementViewer.propTypes = {
    element: PropTypes.object.isRequired,
    rows: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    new: PropTypes.bool
};

ElementViewer.contextTypes = {
    intl: PropTypes.object
};

export default ElementViewer;
