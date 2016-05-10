import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import * as arrays from '../utils/arrays';
import isFunction from 'lodash/fp/isFunction'

export class Thead extends Component {
  render() {
    return (
      <th>{this.props.children}</th>
    )
  }
}

export class Column extends Component {
  render() {
    let { value, className } = this.props;
    return (
      <td className={className ? className : ''}>{value}</td>
    )
  }
}

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {rowsWithDetails: []}
  }

  _createColumn(item, col, idx) {
    let value = col.props.value || item[col.props.name];
    if ('function' === typeof value) {
      value = value.call(null, item[col.props.name], item);
    }
    return React.cloneElement(col, { key: idx, value: value });
  }

  _createDetailRow(rowNum, item, colSpan) {
    return (
      <tr className='detail-row' key={rowNum+'detail'}>
        <td colSpan={colSpan}>
          {this.props.renderDetailRow(rowNum, item)}
        </td>
      </tr>
    )
  }

  _renderEmptyDataMessage(colSpan) {
    return (
      <tr>
        <td colSpan={colSpan}>{this.props.noDataMessage || 'No data found'}</td>
      </tr>
    )
  }

  _renderRows(columnsDef, data) {
    if (data.isEmpty()) {
      return this._renderEmptyDataMessage(columnsDef.length);
    }
    let rows = [];
    data.valueSeq().forEach((item, idx) => {
      item = isFunction(item.toJS) ? item.toJS() : item;
      let tds = columnsDef.map(this._createColumn.bind(this, item));
      let hasDetails = this.state.rowsWithDetails.indexOf(idx) >= 0;
      rows.push(
        <tr className={hasDetails ? 'is-detailed' : ''} onClick={::this.toggleDetails.bind(this, idx)} key={idx}>
          {tds}
        </tr>
      );
      if (hasDetails) {
        rows.push(this._createDetailRow(idx, item, columnsDef.length));
      }
    });
    return rows;
  }

  toggleDetails(rowNum) {
    if (!this.props.renderDetailRow) {
      return null;
    }
    let index = this.state.rowsWithDetails.indexOf(rowNum);
    if (index >= 0) {
      this.state.rowsWithDetails.splice(index, 1);
      return this.setState({ rowsWithDetails: this.state.rowsWithDetails });
    } else {
      return this.setState({ rowsWithDetails: [...this.state.rowsWithDetails, rowNum]});
    }
  }

  _renderHeaders(headers) {
    return headers.map((header, idx) => {
      return (<Thead key={idx}></Thead>);
    })
  }

  _getColumnsDefinition(collumns, headers) {
    let defaultColumn = (name) => (<Column name={name}/>);
    return headers.reduce((defs, header) => {
      let key = header.props.name;
      let colDef = ( collumns.filter(collumn => collumn.props.name === key).shift() ) || defaultColumn(key);
      return [...defs, colDef];
    }, []);
  }

  render() {
    let { renderDetailRow, displayHeader = true } = this.props;
    let data = arrays.toImmutableList(this.props.data);

    let children = React.Children.toArray(this.props.children);
    let headers = children.filter((child) => child.type === Thead);
    if (!headers.length) {
      throw new Error('Table needs at least one Thead child');
    }
    let columns = children.filter((child) => child.type === Column);
    let columnsDef = this._getColumnsDefinition(columns, headers);

    let detailStyle = renderDetailRow ? ' is-detailed' : '';
    return (
      <table className={'table ' + this.props.className + detailStyle}>
        {displayHeader &&
          <thead>
            <tr>
              {headers}
            </tr>
          </thead>
        }
        <tbody>
          {this._renderRows(columnsDef, data, renderDetailRow)}
        </tbody>
      </table>
    )
  }

  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Iterable),
      PropTypes.array
    ]),
    renderDetailRow: PropTypes.func,
    noDataMessage: PropTypes.string
    // How to define that the <Thead> child is required and the Column is not?
    // children: PropTypes.oneOfType([
    //   React.PropTypes.arrayOf(React.PropTypes.node),
    //   React.PropTypes.node
    // ]).isRequired
  };

}
