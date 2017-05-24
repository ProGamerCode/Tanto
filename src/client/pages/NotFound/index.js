/* @flow */

import React from 'react'
import { pureComponent } from 'components/PureComponent'
import Helmet from 'react-helmet'

function NotFound() {
  return (
    <div >
      <Helmet title="NotFound" />
      <h1>404</h1>
    </div>
  )
}

export default pureComponent(NotFound)
