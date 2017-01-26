/* @flow */
import React from 'react'
// import { createSelector } from 'reselect'

// import ChangesetFileList from 'components/ChangesetFileList'
// import ChangesetGroupedList from 'components/ChangesetGroupedList'
// import CodeDiffView from 'components/CodeDiffView'
// import IssuesList from 'components/IssuesList'
// import PullRequestDiscussion from 'components/PullRequestDiscussion'
import PullRequestSummary from 'containers/PullRequestSummary'

type Props = {
  type: string,
  pullRequestId: string,
}

const CategoryModule = ({ type, pullRequestId }: Props) =>
  (<div>
    {type === 'summary' &&
      <PullRequestSummary pullRequestId={pullRequestId} />
    }
    {/* {type === 'discussion' && <PullRequestDiscussion pullRequestId={pullRequestId} />}
    {type === 'files' && <ChangesetFileList pullRequestId={pullRequestId} />}
    {type === 'changesets' &&
      <ChangesetGroupedList accordion={false} pullRequestId={pullRequestId} />}
    {type === 'issues' && <IssuesList pullRequestId={pullRequestId} />}
    {type === 'diff' && <CodeDiffView pullRequestId={pullRequestId} />
    }*/}
  </div>)

export default CategoryModule

