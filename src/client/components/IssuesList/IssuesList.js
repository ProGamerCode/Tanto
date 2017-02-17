/* @flow */

/* eslint-disable */
import React, { Component } from 'react'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import type { IssueType } from 'universal/types'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import { IssueStatus } from 'universal/constants'
import moment from 'moment'

import _ from 'lodash'

import Avatar from 'components/Avatar'
import './IssuesList.css'

const subHeader = text => (
  <div
    style={{ color: '#8c8c8c', fontSize: '13px' }}
    >
    {text}
  </div>
)

const greenStatus = { borderLeft: '4px solid #d1fad1' }
const redStatus = { borderLeft: '4px solid #F44336' }
const yellowStatus = { borderLeft: '4px solid #ffcbad' }
const greyStatus = { borderLeft: '4px solid lightgrey' }

export type Props = {
  issues: Array<IssueType>,
}

const getStatusColor = (status) => {
  switch (status) {
    case IssueStatus.NOW:
      return redStatus
    case IssueStatus.LATER:
      return yellowStatus
    case IssueStatus.OBSOLETE:
      return greenStatus
    case IssueStatus.AVAILABLE:
      return greenStatus
    default:
      return greyStatus
  }
}

const calculateStatuses = (issues) =>
  issues.reduce((statuses, issue) => {
    if (issue.status in statuses) {
      statuses[issue.status]++;
    }
    else {
      statuses[issue.status] = 1;
    }
    return statuses;
  }, {})

class IssuesList extends Component {
  constructor(props: Props) {
    super(props)
    this.state = { search: null }
  }

  state: {
    search: ?string,
  };

  props: Props

  render() {
    if (!this.props.issues) {
      return null
    }
    const statuses = calculateStatuses(this.props.issues)
    const newTotal = IssueStatus.NOW in statuses ? statuses[IssueStatus.NOW] : 0
    const nextTotal = IssueStatus.NEXT in statuses ? statuses[IssueStatus.NEXT] : 0
    const laterTotal = IssueStatus.LATER in statuses ? statuses[IssueStatus.LATER] : 0

    return (
      <div>
        <Row>
          <Col md={12}>
            <div
              style={{
                display: 'inline-flex',
                border: '1px solid lightgrey',
                borderRadius: '5px',
                padding: '7px',
                width: '100%'
              }}
              >
              <span
                style={{ pagging: '10px', color: 'grey' }}
                >
                <i className="fa fa-search" aria-hidden="true" />
              </span>
              <input
                type="text"
                style={{
                  outline: 'none',
                  border: 'none',
                  marginLeft: '10px',
                  fontSize: '14px',
                  width: '100%'
                }}
                />
              <i className="fa fa-sort-amount-asc" style={{ color: 'lightgrey', margin: '1px 10px', fontSize: '16px' }} aria-hidden="true" />
            </div>
            <div
              style={{ color: 'rgb(122, 123, 123)', fontSize: '12px', padding: '10px' }}
              >
              {newTotal} unresolved in this PR, {nextTotal} fix in next PR, {laterTotal} can be fixed later
            </div>

          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <ListGroup style={{ fontSize: '13px', maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
              {this.props.issues.map(issue => (
                <ListGroupItem
                  key={_.uniqueId('listItem')}
                  style={{
                    padding: '10px 10px',
                    ...(getStatusColor(issue.status))
                  }}
                  >
                  <Row>
                    <Col md={3} sm={6} xs={12}>
                      <div style={{ display: 'table' }}>
                        <Avatar {...issue.owner.slack} />
                        <div style={{ paddingLeft: '10px', display: 'table' }}>
                          <a href="#issue">{issue.title}</a>
                          <div style={{ fontSize: '12px', color: 'grey', fontStyle: 'italic' }}>
                            <span>created by </span>
                            <a style={{ color: '#5a6082' }} href="#file">{issue.owner.fullName}</a>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={3} sm={3} xsHidden>
                      {subHeader('Location:')}
                      {issue.location? issue.location: 'generic'}
                    </Col>
                    <Col md={3} sm={3} xsHidden>
                      {subHeader('Assigned to:')}
                      {issue.assignee.fullName}
                    </Col>
                    <Col md={3} smHidden xsHidden>
                      {subHeader('Created:')}
                      {moment(issue.created).fromNow()}
                    </Col>
                  </Row>
                </ListGroupItem>))}
            </ListGroup>
          </Col>
        </Row>
      </div>
    )
  }
}

export default IssuesList
