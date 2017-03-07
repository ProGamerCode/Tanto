/* @flow */

import React, { PureComponent } from 'react'
import type { FileType } from 'universal/types'
import { connect } from 'react-redux'

import { getPullRequestFiles } from 'ducks/pullrequests/selectors'
import { createSelector } from 'reselect'
import ChangesetFileList from 'components/ChangesetFileList'
import { getLoggedUsername } from 'ducks/session/selectors'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import CodeDiffContainer from 'containers/CodeDiffContainer'
import { StickyContainer, Sticky } from 'react-sticky'


type Props = {
  files: Array<FileType>,
  pullRequestId: string,
  loggedUsername: string,
}

export const getData = (state: Object, props: Object): Object =>
  createSelector(
    getPullRequestFiles, getLoggedUsername,
    (files, status, user) => ({
      files,
      loggedUsername: user,
    })
  )

class PullRequestDiff extends PureComponent {

  props: Props

  render() {
    if (!this.props.files) {
      return null
    }
    const containerId = 'diffContainer'
    return (
      <StickyContainer>
        <Row>
          <Col md={4}>
            <Sticky>
              <ChangesetFileList
                files={this.props.files}
                compact
                containerElementName={containerId}
              />
            </Sticky>
          </Col>
          <Col md={8} id="containerElementName">
            {this.props.files.map(file =>
              <CodeDiffContainer fileName={file.name} pullRequestId={this.props.pullRequestId} />
            )}
          </Col>
        </Row>
      </StickyContainer>
    )
  }

}
/* flow-disable */
export default connect(getData)(PullRequestDiff)
