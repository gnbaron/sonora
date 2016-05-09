import React, { Component, PropTypes } from 'react';
// import PageClick from 'react-page-click';
import Immutable from 'immutable';
import { Link } from 'react-router';
import debounce from 'lodash/fp/debounce';
import isFunction from 'lodash/fp/isFunction';
import * as arrays from '../utils/arrays';
import Popper from './popper';

export class DropdownSearch extends Component {
  constructor(props) {
    super(props);
    let data = arrays.toImmutableList(props.data).valueSeq();
    this.state = {filterText: '', filteredData: data}
    this._filterData = debounce(100, this._filterData.bind(this, data));
  }

  _filter(item, filterText, keys) {
    item = isFunction(item.toJS) ? item.toJS() : item;
    let filtered = keys.filter(key => (''+item[key]).toLowerCase().indexOf(filterText.toLowerCase()) >= 0);
    return filtered && filtered.length;
  }

  _filterData(data) {
    let filterKeys = this.props.filterKeys || ['text'];
    let newData = data.filter(item => this._filter(item, this.state.filterText, filterKeys));
    this.setState({filteredData: newData});
  }

  _handleChange(evt) {
    this.setState({filterText: evt.target.value});
    this._filterData(evt.target.value);
  }

  render() {
    let placeholder = this.props.placeholder || 'Search';
    let childrens = React.Children.map(this.props.children, child => {
      if (child.type == DropdownBody) {
        return React.cloneElement(child, {data: this.state.filteredData});
      }
      return child;
    })
    return (
      <div className="dropdown-search">
        <input
          className="input"
          type="text"
          placeholder={placeholder}
          value={this.state.filterText}
          onChange={::this._handleChange}
          >
        </input>
        {childrens}
      </div>
    )
  }
}

export class DropdownHeader extends Component {
  render() {
    return (
      <div className="dropdown-header">
        <div className="dropdown-title">
          {this.props.children}
        </div>
        <div className="dropdown-close">
          <a href="javascript: void(0)" onClick={::this.props.onClose}>
            <i className="fa fa-close"></i>
          </a>
        </div>
      </div>
    )
  }
}

export class DropdownBody extends Component {
  _renderItem(item, idx) {
    item = isFunction(item.toJS) ? item.toJS() : item;
    let defaultRender = () => (<Link to={item.href}>{item.text}</Link>);
    let render = this.props.renderItem || defaultRender;
    return (
      <li key={idx}>{render(item, idx)}</li>
    )
  }

  render() {
    let data = arrays.toImmutableList(this.props.data).valueSeq();
    let items = data.map(::this._renderItem);
    return (
      <div className='dropdown-body'>
        {items &&
          <ul>
            {items}
          </ul>
        }
        {this.props.children}
      </div>
    )
  }

  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Iterable),
      PropTypes.array
    ]),
    renderItem: PropTypes.func
  }
}

export class DropdownToggle extends Component {
  render() {
    return (
      <a onClick={::this.props.onClick}
         className={'dropdown-toggle ' + this.props.className}>
         {this.props.children}
      </a>
    )
  }
}

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  close() {
    if (this.state.isOpen) {
      this.setState({isOpen: false});
    }
  }

  toggle(e) {
    e && e.stopPropagation();
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    let { isOpen } = this.state;
    let childArray = React.Children.toArray(this.props.children);
    let toggles = childArray.filter(child => child.type === DropdownToggle);
    let childrens = childArray.filter(child => child.type !== DropdownToggle);
    let hasHeader = false;
    let style = {};
    if (this.props.width) {
      style = {minWidth: this.props.width}
    }

    toggles = toggles.map(child => {
      return React.cloneElement(child, {onClick: ::this.toggle})
    });
    childrens = childrens.map(child => {
      hasHeader = hasHeader || (child.type === DropdownHeader)
      if (child.type === DropdownHeader && !child.props.onClose) {
        return React.cloneElement(child, {onClose: ::this.close});
      }
      return child;
    });

    return (
      <Popper isVisible={isOpen} ref="popper" arrow={this.props.arrow} placement={this.props.placement || 'bottom-end'}>
        {toggles}
        <div className={'dropdown ' + (hasHeader ? 'has-header' : '')} style={style}>
          {isOpen && childrens}
        </div>
      </Popper>
    )
  }
}


export default Dropdown;
