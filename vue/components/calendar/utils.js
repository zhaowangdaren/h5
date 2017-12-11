function isLeapYear (year) {
  return year % 100 !== 0 && year % 4 === 0 || year % 400 === 0
}

function getMaxDay (year, month) {
  year = parseInt(year)
  month = parseInt(month)
  if (month === 1) {
    return isLeapYear(year) ? 29 : 28
  }
  return [3, 5, 8, 10].indexOf(month) >= 0 ? 30 : 31
}

/**
 * 获取当天是周几
 * @param  {int} year
 * @param  {int} month
 * @param  {int} date
 * @return {string}
 */
function getDayCN (year, month, date) {
  var temp = new Date(year + '/' + (month + 1) + '/' + date)
  switch (temp.getDay()) {
    case 0:
      return '周日'
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
  }
}

/**
 * 获取当前月份有多少个周的跨度
 * @param  {int} year
 * @param  {int} month
 * @param {int} maxDay 该月最大天数
 * @return {int}
 */
function getWeeks (year, month, maxDay) {
  var firstDay = new Date(year + '/' + (month + 1) + '/1').getDay()
  if (maxDay % 7 === 0) {
    return firstDay === 1 ? Math.ceil(maxDay / 7) : Math.ceil(maxDay / 7 + 1)
  } else {
    return Math.ceil(maxDay / 7 + 1)
  }
}

export {
  getMaxDay,
  isLeapYear,
  getDayCN,
  getWeeks
}
