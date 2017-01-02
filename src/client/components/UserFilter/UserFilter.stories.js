/* @flow */
import React from 'react'
import { storiesOf } from '@kadira/storybook'

import UserFilter from './UserFilter.js'

storiesOf('UserFilter', module)
  .add('default', () => (
    <UserFilter />
  ))