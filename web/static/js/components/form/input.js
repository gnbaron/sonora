import React, {Component, PropTypes} from 'react';

export class InputGroup extends Component {
  render() {
    return (
      <div className="input-group">
        {this.props.children}
      </div>
    )
  }
}

class FormInput extends Component {

  render() {
    const { label, field, groupClass } = this.props;
    let hasError = (field.error && field.touched) ? 'is-danger' : '';
    let cloneWithError = (child) => React.cloneElement(child, { className: child.props.className + ' ' + hasError });
    let childrenWithErrors = React.Children.map(this.props.children, (child) => {
      if (child.type === InputGroup) {
        let newChildrens = React.Children.map(child.props.children, cloneWithError);
        return React.cloneElement(child, {children: newChildrens});
      }
      return cloneWithError(child);
    });
    return (
      <div className={groupClass}>
        {label && <label className='label'> {label} </label>}
        {childrenWithErrors}
        {
          field.error && field.touched &&
          <span className={'help ' + hasError}>
            {field.error}
          </span>
        }
      </div>
    )
  }

  static propTypes = {
    field: PropTypes.object.isRequired,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    groupClass: PropTypes.string,
    errorClass: PropTypes.string,
    children: PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]).isRequired
  };

  static defaultProps = {
    groupClass: 'control'
  }
}

export default FormInput;
