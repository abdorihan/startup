import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactTable from 'react-table';

class Table extends Component {
    render() {
        return (
            <ReactTable
                className='-striped -highlight'
                data={this.props.data}
                columns={this.props.columns}
                defaultPageSize={10}
                sortable
                multiSort
                resizable
                filterable
                defaultFilterMethod={(filter, row) => {
                    const id = filter.pivotId || filter.id;
                    return row[id] !== undefined ? String(row[id]).toLowerCase().startsWith(filter.value.toLowerCase()) : true;
                }}
                getTrProps={(state, row) => {
                    return {
                        style: { cursor: row ? 'pointer' : '' },
                        onClick: () => {
                            if (typeof this.props.onClick === 'function') {
                                const onclickEvent = this.props.onClick.bind(this, row);
                                onclickEvent();
                            }
                        }
                    };
                }}
            />
        );
    }
}

Table.defaultProps = {
    data: [],
    columns: []
};

Table.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
};

export default Table;
