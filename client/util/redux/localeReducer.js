export const setLocale = locale => ({
  type: 'SET_LOCALE',
  locale,
})

export const localeSelector = state => state.common.locale

export default (state = { locale: 'fi' }, action) => {
  switch (action.type) {
    case 'SET_LOCALE':
      return {
        locale: action.locale,
      }

    default:
      return state
  }
}
