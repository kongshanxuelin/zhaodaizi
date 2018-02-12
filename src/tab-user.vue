<template>
  <div>
     <scroller class="scroller">
        <div style="padding-top:20px;padding-bottom:20px;padding-left:30px;display:flex;flex-direction:row;">
            <image :src="user.avator" style="width:150px;height:150px;border-radius:20%;"></image>
            <div style="height:150px;padding-left:30px;">
              <text style="height:70px;line-height:70px;color:#121212;">{{user.nick}}</text>
              <text style="height:70px;line-height:70px;color:#121212;">ID:{{user.uid}}</text>
            </div>
        </div>  
        <wxc-cell label="头像修改"
                  
                  @wxcCellClicked="changeAvator"
                  :has-arrow="true"
                  :has-margin="true"></wxc-cell>

        <wxc-cell label="基本资料修改"
                  :title="user.nick"
                  @wxcCellClicked="navPage('page.changenick',{nick:user.nick})"
                  :has-arrow="true"
                  :has-margin="false"></wxc-cell>
        <wxc-cell label="联系方式修改"
                  :title="user.tel"
                  @wxcCellClicked="navPage('page.changetel',{tel:user.tel})"
                  :has-arrow="true"
                  :has-margin="true"></wxc-cell>
        <!--
        <wxc-cell :has-arrow="false"
                  label="xxxx"
                  :has-top-border="false"
                  :auto-accessible="false">
          <switch slot="value"></switch>
        </wxc-cell>
        -->
        <wxc-cell label="清理缓存"
          @wxcCellClicked="clearCache"
          :has-arrow="true"
          :has-margin="true"></wxc-cell>

      </scroller>
  </div>
</template>
<style src='./css/sumslack.css' />
<style scoped>
  
</style>

<script>
  import { WxcCell, Utils } from 'weex-ui';
  import SsIcon from './inc/icon.vue';
  const Sumslack = require("./sumslack/js/sumslack.js");
  const httpService = require("./sumslack/js/http-service.js");

  export default {
    components: { WxcCell },
    props: {
      user:{
        type:Object
      }
    },
    data: () => ({
      showCard:true
    }),
    computed: {

    },
    methods:{
      //修改头像
      changeAvator(){
        var that = this;
        Sumslack.chooseImage(1,0,function(res){
            res = Sumslack.toJSON(res);
            let _imgs = res.list;
            if(_imgs && _imgs.length === 1){    
                Sumslack.toast("正在上传...");
                Sumslack.uploadImage(_imgs[0],function(result){
                    result = Sumslack.toJSON(result);
                    if(result.status === "success"){
                        let remoteUrl = result.remoteThumbUrl;
                        httpService.saveAvator(remoteUrl,function(json){
                          //Sumslack.alert(Sumslack.print(json));
                          if(json.ret){
                            Sumslack.alert("头像保存成功");
                            that.user.avator = remoteUrl;
                          }else{
                            Sumslack.alert("头像保存失败");
                          }
                        });
                    }else if(result.status === "fail"){
                        Sumslack.alert("修改头像失败！");
                    }else{
                        //Sumslack.toast("正在上传..."+Math.round(result.bytesWritten*100/result.totalSize) + '%');  
                    }
                });
            }
        });
      },
      navPage(pageId,param){
          Sumslack.navigateTo(pageId,param);
      },
      clearCache(){
        Sumslack.clearStorage();
        Sumslack.toast("清理缓存成功");
      }
    }
  };
</script>