/* @flow */

import React, { Component } from 'react'
import { default as Select } from 'components/VirtualizedSelect'
import { connect } from 'react-redux'
import { fetchRepositoryBranches } from 'ducks/repositories/actions'
import { getRepositoryBranches } from 'ducks/repositories/selectors'

type SelectItemType = {
  label: string,
  value: string,
}

type BranchProps = {
  repoId: number,
  options: Array<SelectItemType>,
  onSelect: Function,
  style: ?Object,
  dispatch: Function,
}


class BranchSelect extends Component {
  constructor(props: BranchProps) {
    super(props)
    this.state = { branch: null }
  }

  state: {
    branch: ?SelectItemType,
  }

  componentDidMount() {
    // TODO : enable search instead of fetching all branches
    // if (this.props.repoId) {
    //   this.props.dispatch(fetchRepositoryBranches(this.props.repoId))
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.repoId !== nextProps.repoId) {
      this.props.dispatch(fetchRepositoryBranches(nextProps.repoId))
    }
  }

  props: BranchProps

  handleBranchChange = (branch: SelectItemType): void => {
    this.setState({ branch })
    if (this.props.onSelect) {
      this.props.onSelect(branch ? branch.value : '')
    }
  }

  render() {
    return (
      <Select
        style={this.props.style}
        value={this.state.branch}
        name="branch"
        options={this.props.options}
        onChange={this.handleBranchChange}
        placeholder="branch ..."
      />
    )
  }
}

export default connect(
  (state, props) => ({
    options: getRepositoryBranches(state, props),
  })
)(BranchSelect)
