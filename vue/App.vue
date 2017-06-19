<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style module>
  .wrap{
    display: flex;
  }
</style>
<script>
  export default {
    mounted(){
      this.hh();
    },
    methods:{
      hh(){
        this.bb(a =>{
          console.info(a);
        });
        console.info('ads');
      },
      bb(){
        return '123'
      }
    }
  }
</script>