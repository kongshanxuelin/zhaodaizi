<template>
    <scroller>
        <div class="container">
              <div class="text-nav">
                <text style="color:#aaaaaa">申请/已搭伙的小伙伴们,请确认允许哪些人搭伙</text>
              </div>
              <wxc-cell :has-arrow="false"
                        :has-top-border="false"
                        :auto-accessible="false"
                        v-for="da in daList"
                        :key="da.id">
                <div class="list-title"
                      slot="title">
                    <text>{{da.name}}</text>  
                    <text style="color:grey">{{da.memo}}</text>
                </div>
                      
                <switch slot="value"
                        :checked="da.sts=='1'" @change="switchChange($event,da.uid)"></switch>
              </wxc-cell>
            
        </div>
    </scroller>
</template>
<style src='./css/sumslack.css' />
<style>
   .list-title {
       display: flex;
       flex-direction: column;
   }
</style>

<script>
    const config = require("./sumslack/js/config.js");
    const Sumslack = require("./sumslack/js/sumslack.js");
    const httpService = require("./sumslack/js/http-service.js");
    import { WxcCell } from 'weex-ui';
    export default {
        data: {
            daList:[
                //{uid:"12",name:"测试人员",avator:"http://h5.sumslack.com/img/default_user.png",phone:"131121212"}
            ],
            fid:"",
            height:"800px"
        },
        components: {
          WxcCell
        },
        created () {
            var that = this;
            this.fid = Sumslack.getHttp().getUrlParam(this,"fid") || "10";
            httpService.listDaList(this.fid,function(json){
                that.daList = json;
            });
            var height = this.$getConfig().env.deviceHeight - 50;
            this.height = height + "px";
        },
        methods: {
            "switchChange":function (event,uid) {
                httpService.daConfirm(this.fid,uid,event?"1":"0",function(json){
                    if(!json.ret){
                      Sumslack.alert(json.msg);
                    }else{
                        if(event){
                            Sumslack.alert("该用户已确认！");
                        }else{
                            Sumslack.alert("该用户已取消确认！");
                        }
                    }
                });
            }
        }
    }
</script>
