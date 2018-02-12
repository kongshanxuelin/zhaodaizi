<template>
<div class="wxc-demo">
    <scroller class="scroller">
      <input type="text" class="input" :autofocus=true v-model="tel" onreturn="onreturn"/>
    </scroller>
  </div>
</template>

<script>
  import { WxcCell  } from 'weex-ui';
  const Sumslack = require("./sumslack/js/sumslack.js");
  const httpService = require("./sumslack/js/http-service.js");
  module.exports = {
    components: { WxcCell  },
    data: () => ({
      tel: ''
    }),
    created(){
      var that = this;
      this.tel = Sumslack.getHttp().getUrlParam(this,"tel") || "";
      this.tel = decodeURIComponent(this.tel);
      Sumslack.init("修改联系方式",[{"title":"保存","href":"javascript:saveIt"}],function(){
            Sumslack.addGlobalEventListener("saveIt",function(){
                httpService.saveTel(that.tel,function(json){
                  Sumslack.alert(Sumslack.print(json));
                  if(json.ret){
                    Sumslack.redirectTo("page.index");
                  }else{
                    Sumslack.alert("保存失败");
                  }
                });
            });
      });
    },
    methods: {
      onreturn () {
        Sumslack.toast(this.tel);
      }
    }
  };
</script>

<style scoped>
  .wxc-demo {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #F6F9F8;
  }
  .scroller {
    flex: 1;
  }
  .input {
    margin-top:40px;
    height:70px;
    font-size: 60px;
    width: 710px;
    margin-left:20px;
    border-width: 1px;
    border-color:beige;
    border-style: solid;
    background-color: #FEFEFE;
  }
</style>