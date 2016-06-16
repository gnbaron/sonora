import React, { Component, PropTypes } from 'react';
import isFunction from 'lodash/fp/isFunction';
import ReactSelect from 'react-select';

let stringOrFuncProp = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.func
]);

export default class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {options: this._parseData(props)}
  }
  _parseData(props) {
    let { valueKey, descriptionKey, data } = props;
    valueKey = this._normalizeAccessor(valueKey);
    descriptionKey = this._normalizeAccessor(descriptionKey);
    return data
      .map(item => {
        return {
          value: valueKey(item),
          label: descriptionKey(item),
          instance: item
        }
      });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({options: this._parseData({...this.props, ...nextProps})});
    }
  }
  _normalizeAccessor(accessor) {
    if (!isFunction(accessor)) {
      return (item) => isFunction(item.get) ? item.get(accessor) : item[accessor];
    }
    return accessor;
  }

  _handleBlur() {
    //Avoid sending an empty string to the server when the user doesn't select any value
    let value = this.props.value === '' ? null : this.props.value;
    this.props.onBlur({value: value});
  }

  render() {
    let { options } = this.state;
    //valueKey is a ReactSelect prop so we return its original value here
    let normalizedProps = {...this.props, valueKey: 'value'};

    return (
      <ReactSelect
        options={options}
        noResultsText="No data found"
        {...normalizedProps}
        onBlur={::this._handleBlur} //redux-form hack
      />
    )
  }

  static propTypes = {
    data: PropTypes.array,
    noResultsText: PropTypes.string,
    valueKey: stringOrFuncProp.isRequired,
    descriptionKey: stringOrFuncProp.isRequired
  }
}
