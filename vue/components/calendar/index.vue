<template>
  <div :class='s.wrap'>
    <div :class='s.monthCalendar'>
      <div :class='s.daysTip'>
        <div>一</div>
        <div>二</div>
        <div>三</div>
        <div>四</div>
        <div>五</div>
        <div>六</div>
        <div>日</div>
      </div>
      <div
        ref='months'
        :class='s.months'
        @scroll='onMonthScroll'
        @touchstart='onMonthsTouchStart'
        @touchmove='onMonthsTouchMove'
        @touchend='onMonthsTouchEnd'>
        <div
          :data='month.year + "-" + month.month'
          :key='month.year + "-" + month.month'
          :class='s.month'
          v-for='month in calendar.panel'>
          <div :class='s.monthTip'>{{month.year}}年{{month.month + 1}}月</div>
            <div
              :class='s.week'
              v-for='week in getWeeks(month.year, month.month, month.days)'>
              <div
                v-for='day in 7'
                :class='s.day'>
                  <template
                    v-if='getDay(month, week, day) > 0 &&
                          getDay(month, week, day) <= month.days'
                    >
                    {{getDay(month, week, day)}}
                  </template>
                </div>
            </div>
        </div>
      </div>
    </div>
    <div :class='s.barCalendar'>
      <span
        ref='barMonth'
        :class='s.month'>
        <div>{{(calendar.barMonth.month + 1)}}月</div>
      </span>
      <div
        :class='s.days'
        ref='days'>
        <div
          v-for='date in calendar.barMonth.days'
          @click='onDay(calendar.barMonth.year, calendar.barMonth.month, date)'
          :class='[s.dayWrap, {[s.active]: (calendar.active.value[0] === calendar.barMonth.year &&
            calendar.active.value[1] === calendar.barMonth.month && date === calendar.active.value[2])}]'
          >
          <div :class='s.date'>{{date}}</div>
          <div :class='s.day'>{{calendar.barMonth.year, calendar.barMonth.month, date | getDayCN}}</div>
        </div>
      </div>
      <img :class='s.moreIcon' src='~./imgs/down.png'>
    </div>
  </div>
</template>

<script>
import { getDayCN, getMaxDay } from './utils'
export default {
  filters: {
    getDayCN
  },
  data () {
    return {
      activeDomMonthIndex: 0,
      activeDomDayIndex: 0,
      today: {
        year: 0,
        month: 0,
        date: 0
      },
      calendar: {
        hasInit: false,
        hasUnshiftMonth: false,
        hasPushMonth: false,
        secondMonthOffsetTop: 0,
        thirdMonthOffsetTop: 0,
        lastMonthOffsetTop: 0,
        preScrollTop: 0,
        active: {
          value: [2017, 11, 8],
          domIndex: {
            month: 0,
            day: 0
          }
        },
        barMonth: {
          year: 2017,
          month: 11,
          days: 31
        },
        panel: [
          { // 当前用户正在看的前一个月份
            year: 2017,
            month: 10,
            days: 30 // 该月天数
          },
          { // 用户正在看的一个月份
            year: 2017,
            month: 11,
            days: 31
          },
          { // 用户正在看的后一个月份
            year: 2018,
            month: 0,
            days: 31
          }
        ],
        preActivePanelIndex: 1,
        activePanelIndex: 1 // 当前用户正在看的月份在panel的index
      }
    }
  },
  computed: {
  },
  mounted () {
    var tempDate = new Date()
    this.today = {
      year: tempDate.getFullYear(),
      month: tempDate.getMonth(),
      date: tempDate.getDate()
    }
    this.calendar.active.value = [this.today.year, this.today.month, this.today.date]
    this.$nextTick(() => {
      var activeDOM = this.getInitActiveDayDOM()
      this.$refs.days.scrollTo(activeDOM.offsetLeft - this.$refs.barMonth.clientWidth - activeDOM.clientWidth * 3, 0)
      this.calendar.secondMonthOffsetTop = this.$refs.months.childNodes[1].offsetTop
      this.calendar.thirdMonthOffsetTop = this.$refs.months.childNodes[2].offsetTop
      this.$refs.months.scrollTo(0, this.calendar.secondMonthOffsetTop)
      // this.calendar.panel.unshift({
      //   year: 2017,
      //   month: 10,
      //   days: 30
      // })
      // this.calendar.panel.push({
      //   year: 2018,
      //   month: 0,
      //   days: 31
      // })
    })
  },
  methods: {
    getDayIndex (year, month, date) {
      var day = new Date(year + '/' + (month + 1) + '/' + date).getDay()
      if (day === 0) {
        return 7
      } else {
        return day
      }
    },
    getDay (month, week, day) {
      return (day + 7 * (week - 1)) - this.getDayIndex(month.year, month.month, 1) + 1
    },
    /**
     * 获取当前月份有多少个周的跨度
     * @param  {int} year
     * @param  {int} month
     * @param {int} maxDay 该月最大天数
     * @return {int}
     */
    getWeeks (year, month, maxDay) {
      var firstDay = this.getDayIndex(year, month, 1)
      var lastDay = this.getDayIndex(year, month, maxDay)
      return (maxDay - (8 - firstDay + lastDay)) / 7 + 2
    },
    getInitActiveDayDOM () {
      return this.$refs.days.childNodes[this.today.date - 1]
    },
    onDay (year, month, date) {
      this.calendar.active.value = [year, month, date]
    },
    addMonth (isHeader) {
      var tempDate = isHeader ? new Date(this.calendar.panel[0].year + '') : new Date(this.calendar.panel[this.calendar.panel.length - 1].year + '')
      isHeader ? tempDate.setMonth(this.calendar.panel[0].month - 1) : tempDate.setMonth(this.calendar.panel[this.calendar.panel.length - 1].month + 1)
      var month = {
        year: tempDate.getFullYear(),
        month: tempDate.getMonth(),
        days: getMaxDay(tempDate.getFullYear(), tempDate.getMonth())
      }
      if (isHeader && !this.calendar.hasUnshiftMonth) {
        this.unshiftArrayItem(this.calendar.panel, 3, month)
        this.calendar.hasUnshiftMonth = true
      }
      if (!isHeader && !this.calendar.hasPushMonth) {
        this.pushArrayItem(this.calendar.panel, 3, month)
        this.calendar.hasPushMonth = true
      }
      this.$nextTick(() => {
        console.info('render finished')
        this.calendar.secondMonthOffsetTop = this.$refs.months.childNodes[1].offsetTop
        this.calendar.thirdMonthOffsetTop = this.$refs.months.childNodes[2].offsetTop
        this.calendar.lastMonthOffsetTop = this.$refs.months.lastChild.offsetTop
        // 由于延迟vue排序原因，处理滚动到
      })
    },
    unshiftArrayItem (array, keepLen, item) {
      console.info('unshiftArrayItem', item)
      array.unshift(item)
      if (array.length > keepLen) {
        // array.pop()
      }
    },
    pushArrayItem (array, keepLen, item) {
      array.push(item)
      if (array.length > keepLen) {
        // array.shift()
      }
    },
    onMonthScroll (e) {
      console.info('onMonthScroll', e)
      var monthsScrollTop = e.target.scrollTop
      console.info('onMonthScroll', monthsScrollTop)
      if (monthsScrollTop === this.calendar.secondMonthOffsetTop && !this.calendar.hasInit) {
        this.calendar.hasInit = true
        return
      }

      if (monthsScrollTop <= this.$refs.months.clientHeight * 3) {
        console.info('即将触顶')
        this.calendar.hasUnshiftMonth = false
        this.addMonth(true)
      } else if (monthsScrollTop > this.calendar.preScrollTop) { // 向下
        console.info('向底部靠近, lastMonthOffsetHeight:', this.calendar.lastMonthOffsetTop)
        if (monthsScrollTop > this.calendar.lastMonthOffsetTop) {
          console.info('进入last month')
          this.addMonth(false)
        } else if ((monthsScrollTop + this.$refs.months.clientHeight) >= this.$refs.months.scrollHeight) {
          console.info('触底')
          this.calendar.hasPushMonth = false
          this.addMonth(false)
        } else {
          console.info('脱离last month')
          this.calendar.hasPushMonth = false
        }
        this.calendar.preScrollTop = monthsScrollTop
      } else if (monthsScrollTop <= this.calendar.preScrollTop) { // 向上
        console.info('向上')
      }
    },
    onMonthsTouchStart (evt) {
      console.info('onMonthsTouchStart', evt)
    },
    onMonthsTouchMove (evt) {
      console.info('onMonthsTouchMove', evt)
    },
    onMonthsTouchEnd (evt) {
      console.info('onMonthsTouchEnd', evt)
    },
    onCurDOM (panelIndex, day, isCur) {
      if (isCur) {
        // console.info('onCurDOM', 'panelIndex=' + panelIndex + '; day=' + day)
        this.activeDomMonthIndex = panelIndex
        this.activeDomDayIndex = day
      }
      return isCur
    }
  }
}
</script>
<style lang="less" module='s'>
.wrap{

}
.monthCalendar{
  height: 500px;
  overflow: hidden;
  position: relative;
  .daysTip{
    position: absolute;
    top: 0;
    width: 100%;
    color: #999;
    background-color: #ccc;
    font-size: 30px;
    display: flex;
    text-align: center;
    height: 40px;
    div{
      flex: 1;
    }
  }
  .months{
    overflow: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    padding-top: 40px;
  }
  .monthTip{
    color: #999;
    font-size: 30px;
  }
  .month{
    // display: flex;
  }
  .week{
    border-bottom: solid 2px #ccc;
    display: flex;
  }
  .day{
    flex: 1;
    padding: 10px;
    text-align: center;
    font-size: 30px;
  }
}
.barCalendar {
  display: flex;
  align-items: center;
  .yearChange{
    opacity: 0;
  }
  .yearChangeActive{
    transition: all 0.3s ease;
  }
  .month {
    font-size: 30px;
    color: #999;
  }
  .days{
    display: flex;
    flex: 1;
    overflow: auto;
  }
  .dayWrap{
    text-align: center;
    width: 100px;
    min-width: 100px;
    height: 100px;
    min-height: 100px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .date{
    font-size: 32px;
  }
  .day{
    font-size: 20px;
    color: #999;
    word-break: keep-all;
  }
  .active{
    background-color: blue;
    color: #fff;
    .day{
      color: #fff;
    }
  }
}
</style>
