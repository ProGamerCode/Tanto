/* @flow */

import React, { Component } from 'react'

import './Checkbox.css'

export type Props = {
  checked: boolean,
  value: any,
  onChange?: (e: SyntheticInputEvent, value: boolean) => any,
  name: string,
  disabled?: boolean,
}

class Checkbox extends Component {
  /* eslint-disable react/sort-comp */
  constructor(props: Props) {
    super(props);
    this.state = { checked: this.props.checked };
    (this:any).handleClick = this.handleClick.bind(this)
  }

  props: Props

  handleClick(e: SyntheticInputEvent) {
    if (this.props.onChange) {
      this.setState({
        checked: e.target.checked,
      })
      this.props.onChange(e, e.target.checked)
    }
  }

  // TODO: apply material-ui  styling here
  render() {
    const { value, disabled, name } = this.props
    return (
      <div>
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={this.state.checked}
          disabled={disabled}
          onChange={this.handleClick}
          className="checkbox-box"
        />
        <label htmlFor={name} />
      </div>
    )
  }
}

export default Checkbox
