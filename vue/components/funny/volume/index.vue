<template>
  <div :class="$style.wrap">
    <div :class='$style.volumeWrap' @touchstart='enlarge' @touchend='lower'>
      <div :class='$style.gradient' :style='{width: volumeSize + "%"}'></div>
      <i class="iconfont icon-volume" :class='$style.volume'></i>
    </div>
    <div>{{volumeSize}}</div>
  </div>
</template>
<style lang="less" module>
.wrap{
  .volumeWrap{
    background-color: skyblue;
    display: inline-block;
    position: relative;
    .volume {
      color: white;
      font-size: 30px;
      z-index: 2;
      position: relative;
    }
    .gradient{
      position: absolute;
      top: 0;
      left: 0;
      background-color: grey;
      height: 100%;
    }
  }
  
  
}

</style>

<script>
import 'res/iconfont/iconfont.css'


export default {
  data(){
    return {
      volumeSize: 0,
      countTimer: null
    }
  },
  mounted(){

  },
  methods:{
    enlarge(evt){
      evt.preventDefault();
      console.info('touchstart',Number(this.volumeSize));
      this.count();
    },
    lower(evt){
      evt.preventDefault();
      this.volumeSize = 0;
      this.clearCountTImer();
    },
    count(){
      this.volumeSize = this.volumeSize + 1;
      this.clearCountTImer();
      if(this.volumeSize >= 100) return;
      this.countTimer = setTimeout(() => {
        this.count();
      }, 10);
    },
    clearCountTImer(){
      clearTimeout(this.countTimer);
      this.clearTimeout = null;
    }
  }
}
</script>