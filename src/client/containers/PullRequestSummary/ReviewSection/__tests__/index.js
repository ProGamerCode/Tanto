import chai from 'chai'
import {
  getReviews,
} from '../index'

const expect = chai.expect

describe('getReviews', () => {
  it('full data', () => {
    const user1 = 'user1'
    const user2 = 'user2'
    const users = {
      1: user1,
      2: user2,
    }
    const review1 = {
      status: 'ChangesetStatus.UNDER_REVIEW',
      user: 1,
    }
    const review2 = {
      status: 'ChangesetStatus.APPROVED',
      user: 2,
    }
    const expectedData = [
      { ...review1, user: user1 },
      { ...review2, user: user2 },
    ]
    const pullRequests = {
      12: {
        reviews: [review1, review2],
        otherParameter: 'otherParameter',
      },
    }
    const state = {
      entities: {
        pullRequests, users,
      },
    }
    const props = {
      params: {
        prid: 12,
      },
    }
    expect(getReviews(state, props)).to.deep.eql(expectedData)
  })
})
