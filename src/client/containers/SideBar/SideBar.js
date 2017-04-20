/* @flow */

import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer'
import _ from 'lodash'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { ListItem } from 'material-ui/List'
import { toggleSideBar } from 'ducks/sidebar'
import IconButton from 'material-ui/IconButton'
import Open from 'material-ui/svg-icons/navigation/menu'
import { Link } from 'react-router-dom'
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import { getPersona } from 'ducks/session/selectors'
import SelectableList from 'components/SelectableList'
import './SideBar.css'

import { DEVELOPER_PERSONA } from 'universal/constants'

const textColor = 'rgb(88, 89, 89)'

const listItem = (title, icon, badge, open) => (
  <div style={{ color: '#4574b5', fontSize: '20px' }}>
    <div style={{ display: 'inline-table', width: '40px', color: textColor, marginLeft: '5px' }}>
      <i className={`fa fa-${icon}`} aria-hidden="true" />
    </div>
    {open &&
      <span
        style={{
          fontSize: '13px',
          color: textColor,
          textTransform: 'uppercase',
          marginLeft: '10px',
        }}
      >
        {title}
      </span>
    }
    {badge &&
      <div
        className={`badge ${open ? 'badge-main-menu-open' : 'badge-main-menu-closed'}`}
      >{badge}</div>
    }
  </div>
)

const subItem = (icon, title, color, badge, iconbadge, open) => (
  <div style={{ fontSize: '16px' }}>
    {!open &&
      <div style={{ display: 'inline-table', width: '100%', textAlign: 'center', color }}>
        <i className={`fa fa-${icon}`} aria-hidden="true" />
        {!!badge && <div className="badge badge-small">{badge}</div>}
        {!!iconbadge &&
          <div className="badge badge-small">
            <i className={`fa fa-${iconbadge}`} aria-hidden="true" />
          </div>
        }
      </div>
    }

    {open &&
      <Row>
        <Col xs={10}>
          <span
            style={{
              fontSize: '13px',
              color: color || textColor,
              textTransform: 'uppercase',
              marginLeft: '20px',
            }}
          >
            {title}
          </span>
        </Col>
        {!!badge &&
          <Col xs={2}>
            <div className="badge">{badge}</div>
          </Col>
        }
        {!!iconbadge &&
          <Col xs={2}>
            <div className="badge"><i className={`fa fa-${iconbadge}`} aria-hidden="true" /></div>
          </Col>
        }
      </Row>
    }


  </div>
)

export type Props = {
  width: number,
  hiddenWidth: number,
  items: Array<any>,
  subitems: Array<any>,
  open: boolean,
  sideBarMenuItemStyle?: Object,
  sideBarMenuItemSelectedStyle?: Object,
  dispatch: Function,
  defaultValue: number,
  title: string,
  persona: string,
};

class SideBar extends Component {
  props: Props
  redirect(to) {
    this.props.dispatch(push(to))
  }

  render() {
    const {
      items,
      open,
      subitems,
      width,
      hiddenWidth,
      persona,
      defaultValue,
    } = this.props

    const titleStyle = {
      fontFamily: 'Montez',
      fontSize: '48px',
      color: textColor,
      textTransform: 'capitalize',
      //borderBottom: '1px solid rgba(181, 179, 179, 0.258824)',
    }

    const brandStyle = {
      textDecoration: 'none',
      fontSize: '36px',
      color: textColor,
      fontFamily: 'Montez, cursive',
      marginLeft: '10px',
    }

    const drawerStyle = {
      backgroundColor: '#f2f2f2',
      boxShadow: 'none',
      overflow: 'hidden',
      borderRight: '1px solid rgba(60, 95, 144, 0.168627)',
    }

    return (
      <Drawer
        width={open ? width : hiddenWidth}
        containerStyle={drawerStyle}
      >
        <div style={titleStyle}>
          <IconButton
            style={{ margin: '5px' }}
            disableTouchRipple
            iconStyle={{ fill: 'hsla(220, 13%, 49%, 0.98)' }}
            onClick={() => this.props.dispatch(toggleSideBar())}
          >
            <Open />
          </IconButton>
          {open &&
            <Link style={brandStyle} to="/">
              {this.props.title || 'Logo'}
            </Link>
          }
        </div>

        <div
          style={{
            padding: '50px 0 30px 0',
          }}
        >

          <SelectableList defaultValue={defaultValue}>
            {items.map((item, index) =>
              <ListItem
                key={_.uniqueId('_sidebar_item')}
                value={index + 1}
                style={{ color: 'white' }}
                disableTouchRipple
                onClick={() => this.redirect(item.route)}
              >
                {listItem(item.title, item.icon, item.badge, open)}
              </ListItem>
          )}
          </SelectableList>
        </div>

        {subitems.length > 0 && persona !== DEVELOPER_PERSONA &&
          <div style={{ borderTop: '1px solid rgba(248, 248, 248, 0.26)' }}>
            {open &&
              <div
                style={{
                  color: 'lightgrey',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  padding: '15px 20px 5px' }}
              >
                  Page navigation
              </div>
            }
            <SelectableList defaultValue={defaultValue}>
              {subitems.map((item, index) => (
                <Link
                  to={item.link}
                >
                  <ListItem
                    value={index + 1}
                    style={{ color: 'black' }}
                    innerDivStyle={{ padding: '10px' }}
                    disableTouchRipple
                  >
                    {subItem(item.icon, item.title, item.color, item.badge, item.iconbadge, open)}
                  </ListItem>
                </Link>
                )
            )}
            </SelectableList>
          </div>
        }
      </Drawer>
    )
  }
}


export default connect(state => ({
  open: state.sidebar.open,
  persona: getPersona(state),
  items: state.sidebar.items || [],
  subitems: state.sidebar.subitems || [],
  defaultValue: state.sidebar.selected,
}))(SideBar)
