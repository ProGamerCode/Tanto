// TODO: add flow annotations

export const OPEN_SIDE_BAR = 'OPEN_SIDE_BAR'
export const CLOSE_SIDE_BAR = 'CLOSE_SIDE_BAR'
export const SIDE_BAR_ITEMS = 'SIDE_BAR_ITEMS'
export const SIDE_BAR_SELECTED_ITEM = 'SIDE_BAR_SELECTED_ITEM'
export const TOGGLE_SIDE_BAR = 'TOGGLE_SIDE_BAR'
export const SIDE_BAR_SUBITEMS = 'SIDE_BAR_SUBITEMS'

const initialState = {
  open: false,
  items: [],
  selected: 1,
}

/**
 * Reducer
 */


export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_SIDE_BAR:
      return {
        ...state,
        open: true,
      }
    case TOGGLE_SIDE_BAR:
      return {
        ...state,
        open: !state.open,
      }
    case CLOSE_SIDE_BAR:
      return {
        ...state,
        open: false,
      }
    case SIDE_BAR_ITEMS:
      return {
        ...state,
        items: action.items,
        selected: 1,
      }
    case SIDE_BAR_SELECTED_ITEM:
      return {
        ...state,
        selected: action.selected,
      }
    case SIDE_BAR_SUBITEMS:
      return {
        ...state,
        subitems: action.subitems,
      }
    default:
      return state
  }
}

/**
 * Action Creators
 */


export const selectSideBarItem = (item: Number) => (
  { type: SIDE_BAR_SELECTED_ITEM,
    selected: item,
  }
)

export const toggleSideBar = () => (
  { type: TOGGLE_SIDE_BAR }
)

export const setSideBarToDefault = () => {
  const items = [
    { title: 'Home', route: '/', icon: 'home' },
    { title: 'Projects', route: '/repos', icon: 'folder-open' },
  ]
  return { type: SIDE_BAR_ITEMS, items }
}

export const clearSideBarSubItems = () => (
  { type: SIDE_BAR_SUBITEMS,
    items: [],
  }
)
