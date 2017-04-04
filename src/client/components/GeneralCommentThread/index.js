/* @flow */
import React, { Component } from 'react'
import type { GeneralCommentType } from 'universal/types'
import RichTextEditor from 'components/RichTextEditor'
import Avatar from 'components/Avatar'
import Comment from './Comment'
import type { CommentType } from './Comment'
export type { CommentType } from './Comment'
import './GeneralCommentThread.css'

export type UserType = {
  username: string,
  slack: {
    avatar: string
  }
}
type Props = {
  pullRequestId: string,
  repoId: string,
  comments: Array<GeneralCommentType>,
  loggedUser: UserType,
  description: CommentType,
  onUpdate: (id: string, value: string) => void,
  onDelete: (id: string) => void,
  onSave: (repoId: string, pullrequestId: string, value: string) => void,
  onDescriptionUpdate: (pullrequestId: string, value: string) => void,
}

const renderNewComment = (loggedUser: UserType, handleOnSave: Function, handleOnClose: Function) => (
  <div className="comment-box">
    <div className="comment-box-avatar">
      <Avatar avatar={loggedUser.slack ? loggedUser.slack.avatar : ''} />
    </div>
    <div className="comment-box-content" >
      <RichTextEditor
        onCancel={handleOnClose}
        onSave={handleOnSave}
        cancelButtonTitle={'Close Pull Request'}
        saveButtonTitle={'Add comment'}
      />
    </div>
  </div>
)

const renderDescriptionComment =
  (description: CommentType, loggedUser: UserType, handleOnDescriptionUpdate: Function) => (
    <Comment
      comment={description}
      disableDelete
      canEdit={description.author.username === loggedUser.username}
      onUpdate={handleOnDescriptionUpdate}
    />
  )

class GeneralCommentThread extends Component {
  constructor(props: Props) {
    super(props)

    this.state = {
      editMode: false,
    }
  }

  state: {
    editMode: boolean
  }

  handleOnUpdate = (commentId: string): any => {
    if (this.props.onUpdate) {
      return (value: string) => this.props.onUpdate(commentId, value)
    }
    return null
  }

  handleOnDelete = (commentId: string): any => {
    if (this.props.onDelete) {
      return () => this.props.onDelete(commentId)
    }
    return null
  }

  handleOnSave = (value: string): any => {
    if (this.props.onSave) {
      this.props.onSave(this.props.repoId, this.props.pullRequestId, value)
    }
  }

  handleOnPullRequestClose = (pullRequestId: string) => {
    if (this.props.onSave) {
      this.props.onPullRequestClose(this.props.pullRequestId)
    }
  }

  handleOnDescriptionUpdate = (value: string): any => {
    if (this.props.onSave) {
      this.props.onDescriptionUpdate(this.props.pullRequestId, value)
    }
  }

  render() {
    return (
      <div>
        <div style={{ position: 'relative' }}>
          <div className="comments-thread-timeline">
            {this.props.description &&
              renderDescriptionComment(this.props.description, this.props.loggedUser, this.handleOnDescriptionUpdate)}
            {this.props.comments.map(c =>
              <div className="comments-thread-timeline-item">
                <Comment
                  comment={c}
                  canEdit={c.author.username === this.props.loggedUser.username}
                  onDelete={this.handleOnDelete(c.id)}
                  onUpdate={this.handleOnUpdate(c.id)}
                />
              </div>
            )}
          </div>
        </div>
        {renderNewComment(this.props.loggedUser, this.handleOnSave, this.handleOnPullRequestClose)}
      </div>
    )
  }
}


export default GeneralCommentThread