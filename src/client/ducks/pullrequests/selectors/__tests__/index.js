/* eslint-disable */

import chai from 'chai'
import {
  getPageFetchStatus,
  getPullRequest,
  getPullRequestsPage,
  fileNameSelector,
  getPullRequestsEntities,
  getFilesEntities,
  pullRequestsPageIdsSelector,
  getIssuesEntities,
  getCommentsEntities,
  getPullRequestIssues,
  getPullRequestId,
  getPullRequestFiles,
  getPullRequestGeneralComments,
  getPullRequestFile
} from '../index'

import { types } from '../../actions'

const expect = chai.expect

describe('getPageFetchStatus', () => {
  it('isFetching status pull requests', () => {
    const state = { fetch: { [types.FETCH_PULL_REQUESTS]: { isFetching: false } } }
    expect(getPageFetchStatus(state)).to.eql({ error: null, isFetching: false })

    const state2 = { fetch: { [types.FETCH_PULL_REQUESTS]: { isFetching: true } } }
    expect(getPageFetchStatus(state2)).to.eql({ error: null, isFetching: true })

    expect(getPageFetchStatus({ fetch: {} })).to.eql({ error: null, isFetching: false })
  })

  it('error for pull requests', () => {
    const testerror = { text: 'error message' }
    const state = { fetch: { [types.FETCH_PULL_REQUESTS]: { error: testerror } } }
    expect(getPageFetchStatus(state)).to.eql({ error: testerror, isFetching: false })

    expect(getPageFetchStatus({ fetch: {} })).to.eql({ error: null, isFetching: false })
  })
})

describe('getPullRequest', () => {
  it('with [props.params.prid]', () => {
    const pullRequest = {
      id: 12,
      title: 'test pr',
      description: 'test pr description',
    }
    const state = { entities: { pullRequests: { 12: pullRequest } } }
    const props = { params: { prid: 12 } }
    expect(getPullRequest(state, props)).to.eql(pullRequest)
  })

  it('with [props.pullRequestId]', () => {
    const pullRequest = {
      id: 12,
      title: 'test pr',
      description: 'test pr description',
    }
    const state = { entities: { pullRequests: { 12: pullRequest } } }
    const props = { pullRequestId: 12 }
    expect(getPullRequest(state, props)).to.eql(pullRequest)
  })

  it('with empty state', () => {
    const state = { entities: {} }
    const props = { pullRequestId: 12 }
    expect(getPullRequest(state, props)).to.eql(undefined)
  })


  it('with no PR id', () => {
    const state = { entities: {} }
    const props = {}
    expect(getPullRequest(state, props)).to.eql({})
  })

  it('owner denormalization', () => {
    const state = { entities: {} }
    const props = {}
    expect(getPullRequest(state, props)).to.eql({})
  })

  it('users denormalization', () => {
    const pullRequest = {
      id: 12,
      title: 'test pr',
      description: 'test pr description',
      owner: 3,
      reviews: [{
        status: 0,
        user: 6,
      },
      {
        status: 3,
        user: 1,
      }],
    }
    const users =
      {
        1: { id: 1, username: 'testusername1' },
        3: { id: 3, username: 'testusername3' },
        6: { id: 6, username: 'testusername6' },
      }

    const state = { entities: { pullRequests: { 12: pullRequest }, users } }
    const props = { params: { prid: 12 } }
    const pullRequestExpected = {
      id: 12,
      title: 'test pr',
      description: 'test pr description',
      owner: { id: 3, username: 'testusername3' },
      reviews: [{
        status: 0,
        user: { id: 6, username: 'testusername6' },
      },
      {
        status: 3,
        user: { id: 1, username: 'testusername1' },
      }],
    }

    expect(getPullRequest(state, props)).to.eql(pullRequestExpected)
  })
})

describe('getPullRequestsEntities', () => {
  it('not empty entities state', () => {
    const pullRequests =
      {
        12: {
          id: 12,
          title: 'test pr',
          description: 'test pr description',
        },
      }
    const state = { entities: { pullRequests } }
    expect(getPullRequestsEntities(state)).to.eql(pullRequests)
  })

  it('empty entities state', () => {
    const state = { entities: {} }
    expect(getPullRequestsEntities(state)).to.eql({})
  })

  it('empty pullRequests state', () => {
    const state = { entities: { pullRequests: {} } }
    expect(getPullRequestsEntities(state)).to.eql({})
  })
})

describe('getPullRequestId', () => {
  it('with [props.params.prid]', () => {
    const state = {}
    const props = { params: { prid: 12 } }
    expect(getPullRequestId(state, props)).to.eql(12)
  })

  it('with [props.pullRequestId]', () => {
    const state = {}
    const props = { pullRequestId: 12 }
    expect(getPullRequestId(state, props)).to.eql(12)
  })

  it('with [props.id]', () => {
    const state = {}
    const props = { id: 12 }
    expect(getPullRequestId(state, props)).to.eql(12)
  })

  it('no id', () => {
    const state = {}
    const props = {}
    expect(getPullRequestId(state, props)).to.eql(undefined)
  })
})

describe('pullRequestsPageIdsSelector', () => {
  it('no pagination settings', () => {
    const pullRequest1 = {
      id: 12,
      title: 'test pr',
      description: 'test pr description',
    }

    const pullRequest2 = {
      id: 122,
      title: 'test pr2',
      description: 'test pr description2',
    }
    const state = {
      session: {
        pullRequests: {

        },
      },
      entities: {
        pullRequests: { 12: pullRequest1, 122: pullRequest2 },

      },
    }

    expect(pullRequestsPageIdsSelector(state, {})).to.eql([])
  })

  it('the first current page settings', () => {
    const pullRequest1 = {
      id: 12,
      title: 'test pr',
      description: 'test pr description',
    }

    const pullRequest2 = {
      id: 122,
      title: 'test pr2',
      description: 'test pr description2',
    }
    const state = {
      session: {
        pullRequests: {
          pagination: {
            currentPage: 0,
            pages: {
              0: [212, 7],
              1: [12, 2],
            },
          },
        },
      },
      entities: {
        pullRequests: { 12: pullRequest1, 122: pullRequest2 },

      },
    }
    expect(pullRequestsPageIdsSelector(state, {})).to.eql([212, 7])
  })

  it('no pages settings', () => {
    const pullRequest1 = {
      id: 12,
      title: 'test pr',
      description: 'test pr description',
    }

    const pullRequest2 = {
      id: 122,
      title: 'test pr2',
      description: 'test pr description2',
    }
    const state = {
      session: {
        pullRequests: {
          pagination: {
            currentPage: 0,
          },
        },
      },
      entities: {
        pullRequests: { 12: pullRequest1, 122: pullRequest2 },

      },
    }
    expect(pullRequestsPageIdsSelector(state, {})).to.eql([])
  })

  it('available pages', () => {
    const pullRequest1 = {
      id: 12,
      title: 'test pr',
      description: 'test pr description',
    }

    const pullRequest2 = {
      id: 122,
      title: 'test pr2',
      description: 'test pr description2',
    }

    const pullRequest3 = {
      id: 2,
      title: 'test pr22',
      description: 'test pr description22',
    }
    const state = {
      session: {
        pullRequests: {
          pagination: {
            currentPage: 1,
            pages: {
              1: [12, 2],
            },
          },
        },
      },
      entities: {
        pullRequests: { 12: pullRequest1, 122: pullRequest2, 2: pullRequest3 },

      },
    }

    expect(pullRequestsPageIdsSelector(state, {})).to.eql([12, 2])
  })
})

describe('getPullRequestsPage', () => {
  it('available pull requests', () => {
    const pullRequest1 = {
      id: 1,
      title: 'test pr',
      description: 'test pr description',
    }

    const pullRequest2 = {
      id: 2,
      title: 'test pr2',
      description: 'test pr description2',
    }

    const pullRequest3 = {
      id: 3,
      title: 'test pr22',
      description: 'test pr description22',
    }
    const state = {
      session: {
        pullRequests: {
          pagination: {
            currentPage: 1,
            pages: {
              1: [1, 3],
            },
          },
        },
      },
      entities: {
        pullRequests: { 1: pullRequest1, 2: pullRequest2, 3: pullRequest3 },

      },
    }
    expect(getPullRequestsPage(state, {})).to.eql([pullRequest1, pullRequest3])
  })

  it('not available pull requests', () => {
    const pullRequest1 = {
      id: 1,
      title: 'test pr',
      description: 'test pr description',
    }

    const pullRequest2 = {
      id: 2,
      title: 'test pr2',
      description: 'test pr description2',
    }

    const pullRequest3 = {
      id: 3,
      title: 'test pr22',
      description: 'test pr description22',
    }
    const state = {
      session: {
        pullRequests: {
          pagination: {
            currentPage: 1,
            pages: {
              1: [11, 32],
            },
          },
        },
      },
      entities: {
        pullRequests: { 1: pullRequest1, 2: pullRequest2, 3: pullRequest3 },

      },
    }
    expect(getPullRequestsPage(state, {})).to.eql([])
  })
})

describe('getIssuesEntities', () => {
  it('not empty state', () => {
    const issues =
      {
        12: {
          id: 12,
          title: 'test pr',
          description: 'test pr description',
        },
      }
    const state = { entities: { issues } }
    expect(getIssuesEntities(state)).to.eql(issues)
  })

  it('empty entities state', () => {
    const state = { entities: {} }
    expect(getIssuesEntities(state)).to.eql({})
  })

  it('empty pullRequests state', () => {
    const state = { entities: { issues: {} } }
    expect(getIssuesEntities(state)).to.eql({})
  })
})

describe('getCommentsEntities', () => {
  it('not empty state', () => {
    const comments =
      {
        12: {
          id: 12,
          title: 'test pr',
          description: 'test pr description',
        },
      }
    const state = { entities: { comments } }
    expect(getCommentsEntities(state)).to.eql(comments)
  })

  it('empty entities state', () => {
    const state = { entities: {} }
    expect(getCommentsEntities(state)).to.eql({})
  })

  it('empty pullRequests state', () => {
    const state = { entities: { comments: {} } }
    expect(getCommentsEntities(state)).to.eql({})
  })
})

describe('getPullRequestIssues', () => {
  const users =
    {
      1: { id: 1, username: 'testusername1' },
      3: { id: 3, username: 'testusername3' },
      6: { id: 6, username: 'testusername6' },
    }

  const issues =
    {
      1: { id: 1, title: 'test pr', description: 'test pr description', owner: 3, assignee: 6 },
      12: { id: 12, title: 'test pr12', description: 'test pr description12', owner: 1, assignee: 3 },
      21: { id: 21, title: 'test pr21', description: 'test pr description21', owner: 6, assignee: 1 },
      31: { id: 31, title: 'test pr31', description: 'test pr description31', owner: 3, assignee: 1 },
    }

  it('not empty state', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          issues: [21, 31],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          issues: [1, 12],
        },
      }


    const state = { entities: { issues, pullRequests, users } }
    const props = { params: { prid: 92 } }
    const expected = [
      {
        id: 21, title: 'test pr21', description: 'test pr description21',
        owner: { id: 6, username: 'testusername6' },
        assignee: { id: 1, username: 'testusername1' },
      },
      {
        id: 31, title: 'test pr31', description: 'test pr description31',
        owner: { id: 3, username: 'testusername3' },
        assignee: { id: 1, username: 'testusername1' },
      },
    ]
    expect(getPullRequestIssues(state, props)).to.eql(expected)
  })

  it('missed issue', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          issues: [21, 312],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          issues: [1, 12],
        },
      }


    const state = { entities: { issues, pullRequests, users } }
    const props = { params: { prid: 92 } }
    const expected = [
      {
        id: 21, title: 'test pr21', description: 'test pr description21',
        owner: { id: 6, username: 'testusername6' },
        assignee: { id: 1, username: 'testusername1' },
      },
    ]
    expect(getPullRequestIssues(state, props)).to.eql(expected)
  })

  it('missed owner', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          issues: [21, 31],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          issues: [1, 12],
        },
      }


    const state = { entities: { issues, pullRequests, users: {} } }
    const props = { params: { prid: 92 } }
    const expected = [
      {
        id: 21, title: 'test pr21', description: 'test pr description21',
        owner: {},
        assignee: {},
      }, {
        id: 31, title: 'test pr31', description: 'test pr description31',
        owner: {},
        assignee: {},
      }]
    expect(getPullRequestIssues(state, props)).to.eql(expected)
  })
})

describe('getPullRequestGeneralComments', () => {
  const users =
    {
      1: { id: 1, username: 'testusername1' },
      3: { id: 3, username: 'testusername3' },
      6: { id: 6, username: 'testusername6' },
    }

  const comments =
    {
      1: { id: 1, message: 'test pr', author: 3 },
      12: { id: 12, message: 'test pr12', author: 1 },
      21: { id: 21, message: 'test pr21', author: 6 },
      31: { id: 31, message: 'test pr31', author: 3 },
    }

  it('not empty state', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          comments: [21, 31],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
        },
      }


    const state = { entities: { comments, pullRequests, users } }
    const props = { params: { prid: 93 } }
    const expected = [
      {
        id: 1, message: 'test pr',
        author: { id: 3, username: 'testusername3' },
      },
      { id: 12, message: 'test pr12', author: { id: 1, username: 'testusername1' } },
    ]
    expect(getPullRequestGeneralComments(state, props)).to.eql(expected)
  })

  it('no users entities', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          comments: [21, 31],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
        },
      }


    const state = { entities: { comments, pullRequests, users: {} } }
    const props = { params: { prid: 93 } }
    const expected = [
      {
        id: 1, message: 'test pr',
        author: {},
      },
      { id: 12, message: 'test pr12', author: {} },
    ]
    expect(getPullRequestGeneralComments(state, props)).to.eql(expected)
  })

  it('missed users', () => {
    const comments2 =
      {
        1: { id: 1, message: 'test pr', author: 311 },
        12: { id: 12, message: 'test pr12', author: 1111 },
        21: { id: 21, message: 'test pr21', author: 611 },
        31: { id: 31, message: 'test pr31', author: 3111 },
      }
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          comments: [21, 31],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
        },
      }


    const state = { entities: { comments: comments2, pullRequests, users: {} } }
    const props = { params: { prid: 93 } }
    const expected = [
      {
        id: 1, message: 'test pr',
        author: {},
      },
      { id: 12, message: 'test pr12', author: {} },
    ]
    expect(getPullRequestGeneralComments(state, props)).to.eql(expected)
  })
})

describe('getPullRequestFiles', () => {
  const users =
    {
      1: { id: 1, username: 'testusername1' },
      3: { id: 3, username: 'testusername3' },
      6: { id: 6, username: 'testusername6' },
    }


  it('not empty state', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          files: [2, 1],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
          files: [],
        },
      }

    const files = {
      2: { id: 2, name: 'file name2', comments: [31] },
      1: { id: 1, name: 'file name1', comments: [1, 21, 12] }
    }
    const state = { entities: { pullRequests, users, files } }
    const props = { params: { prid: 92 } }
    const expected =

      [{ id: 1, name: 'file name1', comments: [1, 21, 12] },
      { id: 2, name: 'file name2', comments: [31] }]

    expect(getPullRequestFiles(state, props)).to.eql(expected)
  })

  it('empty state', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          files: [2, 1],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
          files: [],
        },
      }

    const files = {
      2: { id: 2, name: 'file name2', comments: [31] },
      1: { id: 1, name: 'file name1', comments: [1, 21, 12] }
    }
    const state = { entities: { pullRequests, users } }
    const props = { params: { prid: 92 } }
    const expected =
      [{ id: 1, name: 'file name1', comments: [1, 21, 12] },
      { id: 2, name: 'file name2', comments: [31] }]

    expect(getPullRequestFiles(state, props)).to.eql([])
  })

  it('empty pullRequests state', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          files: [2, 1],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
          files: [],
        },
      }

    const files = {
      2: { id: 2, name: 'file name2', comments: [31] },
      1: { id: 1, name: 'file name1', comments: [1, 21, 12] }
    }
    const state = { entities: { users, files } }
    const props = { params: { prid: 92 } }
    const expected =
      [{ id: 1, name: 'file name1', comments: [1, 21, 12] },
      { id: 2, name: 'file name2', comments: [31] }]

    expect(getPullRequestFiles(state, props)).to.eql([])
  })

  it('empty entities state', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          files: [2, 1],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
          files: [],
        },
      }

    const files = {
      2: { id: 2, name: 'file name2', comments: [31] },
      1: { id: 1, name: 'file name1', comments: [1, 21, 12] }
    }
    const state = { entities: {} }
    const props = { params: { prid: 92 } }
    const expected =
      [{ id: 1, name: 'file name1', comments: [1, 21, 12] },
      { id: 2, name: 'file name2', comments: [31] }]

    expect(getPullRequestFiles(state, props)).to.eql([])
  })
})

describe('getFilesEntities', () => {
  it('not empty entities state', () => {
    const files =
      {
        12: {
          id: 12,
          title: 'test file',
          description: 'test pr description',
        },
      }
    const state = { entities: { files } }
    expect(getFilesEntities(state)).to.eql(files)
  })

  it('empty entities state', () => {
    const state = { entities: {} }
    expect(getFilesEntities(state)).to.eql({})
  })

  it('empty files state', () => {
    const state = { entities: { pullRequests: {} } }
    expect(getFilesEntities(state)).to.eql({})
  })
})

describe('fileNameSelector', () => {
  it('empty props', () => {
    const files =
      {
        12: {
          id: 12,
          title: 'test file',
          description: 'test pr description',
        },
      }
    const state = { entities: { files } }
    expect(fileNameSelector(state, {})).to.eql(undefined)
  })

  it('not empty props', () => {
    const state = { entities: {} }
    expect(fileNameSelector(state, { fileName: 'testFilename.cs' })).to.eql('testFilename.cs')
  })
})

describe('getPullRequestFile', () => {
  const users =
    {
      1: { id: 1, username: 'testusername1' },
      3: { id: 3, username: 'testusername3' },
      6: { id: 6, username: 'testusername6' },
    }
  const comments = {
    1: { id: 1, message: 'test pr', author: 3 },
    12: { id: 12, message: 'test pr12', author: 1 },
    21: { id: 21, message: 'test pr21', author: 6 },
  }

  it('not empty state', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          files: [2, 1],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
          files: [],
        },
      }

    const files = {
      2: { id: 2, name: 'file name2', comments: [31] },
      1: { id: 1, name: 'file name1', comments: [1, 21, 12] }
    }
    const state = { entities: { comments, pullRequests, users, files } }
    const props = { params: { prid: 92 }, fileName: 'file name1' }
    const expected =
      {
        id: 1, name: 'file name1', id: 1, name: 'file name1', comments:
        [
          { id: 1, message: 'test pr', author: { id: 3, username: 'testusername3' } },
          { id: 12, message: 'test pr12', author: { id: 1, username: 'testusername1' } },
          { id: 21, message: 'test pr21', author: { id: 6, username: 'testusername6' } },
        ]
      }

    expect(getPullRequestFile(state, props)).to.eql(expected)
  })

  it('empty comments state', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          files: [2, 1],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
          files: [],
        },
      }

    const files = {
      2: { id: 2, name: 'file name2', comments: [31] },
      1: { id: 1, name: 'file name1', comments: [1, 21, 12] }
    }
    const state = { entities: { pullRequests, users, files } }
    const props = { params: { prid: 92 }, fileName: 'file name1' }
    const expected =
      {
        id: 1, name: 'file name1', id: 1, name: 'file name1', comments:[]
      }

    expect(getPullRequestFile(state, props)).to.eql(expected)
  })

  it('empty files state', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          files: [2, 1],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
          files: [],
        },
      }

    const files = {
      2: { id: 2, name: 'file name2', comments: [31] },
      1: { id: 1, name: 'file name1', comments: [1, 21, 12] }
    }
    const state = { entities: { comments, pullRequests, users } }
    const props = { params: { prid: 92 }, fileName: 'file name1' }

    expect(getPullRequestFile(state, props)).to.eql({})
  })

  it('empty pullRequests state', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          files: [2, 1],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
          files: [],
        },
      }

    const files = {
      2: { id: 2, name: 'file name2', comments: [31] },
      1: { id: 1, name: 'file name1', comments: [1, 21, 12] }
    }
    const state = { entities: { comments, files, users } }
    const props = { params: { prid: 92 }, fileName: 'file name1' }

    expect(getPullRequestFile(state, props)).to.eql({})
  })

  it('empty users state', () => {
    const pullRequests =
      {
        92: {
          id: 92,
          owner: 3,
          title: 'test pr92',
          description: 'test pr description92',
          files: [2, 1],
        },

        93: {
          id: 93,
          owner: 1,
          title: 'test pr93',
          description: 'test pr description92',
          comments: [1, 12],
          files: [],
        },
      }

    const files = {
      2: { id: 2, name: 'file name2', comments: [31] },
      1: { id: 1, name: 'file name1', comments: [1, 21, 12] }
    }
    const state = { entities: { comments, pullRequests, files } }
    const props = { params: { prid: 92 }, fileName: 'file name1' }
    const expected =
      {
        id: 1, name: 'file name1', id: 1, name: 'file name1', comments:
        [
          { id: 1, message: 'test pr', author: {}},
          { id: 12, message: 'test pr12', author: {}},
          { id: 21, message: 'test pr21', author: {}},
        ]
      }

    expect(getPullRequestFile(state, props)).to.eql(expected)
  })
})
