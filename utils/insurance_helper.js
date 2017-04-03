import Moment from 'moment'

export const getInsuredAge = (birthday, activeDay = (getTaipeiTime(new Date()))) => {

  if (!Moment.isDate(birthday) || !Moment.isDate(activeDay)) {
    console.log('arguments must be Date object')
    return null
  }
  if (Moment(birthday).isBefore(activeDay)) {
    activeDay = Moment(activeDay).add(6, 'months').format('YYYY/MM/DD')
    const differ = new Date(activeDay) - new Date(birthday)
    const differDays = differ / 1000 / (60 * 60 * 24)
    const insureAge = Math.floor(differDays / 365.25)
    return insureAge
  } else {
    return 0
  }
}
export const getTaipeiTime = (d) => {
  return getTimeByTimezone(d, 8) // Taipei
}
export const getTimeByTimezone = (d, offset) => {

    const utc = d.getTime() + (d.getTimezoneOffset() * 60000)

    const nd = new Date(utc + (3600000 * offset))

    return nd
}
export const isNumeric = (value) => {
  return /^\d+$/.test(value)
}
