<template>
  <div v-if="showCard" class="card">
      <div class="card-title" style="background-color:#fdfdfd;margin-top:5px;margin-bottom:15px;">
          <image @click="openProfile(da.uid)" :src="da.avator" style="width:60px;height:60px;border-radius:50%;margin-right:10px;" class="pr20"></image>
          <text @click="openProfile(da.uid)" class="text-grey pr20">{{da.nick}}</text>
          <div v-if="da.numDone<da.numFutureTotal" style="flex:1;"><text style="color:#bbb;">已完成：{{(new Number(da.numDone*100.0/da.numFutureTotal)).toFixed(2)}}%</text></div>
          <div v-if="da.numDone>=da.numFutureTotal" style="flex:1;"><text style="color:green;font-weight:bold;">已完成</text></div>
          <ss-icon type="fontsumslack" color="#56bdad" :size="50" @click.native="showMoreAction(da)">&#xe762;</ss-icon>
      </div>
      <div class="card-content">
          <div style="display:flex;flex-direction: row;">
              <text class="text-content">{{da.d}}</text>
          </div>
          <div v-if="da.building && da.building!=''" style="display:flex;flex-direction: row;justify-content:center;align-items: center;">
              <ss-icon type="fontsumslack" color="#56bdad" :size="50">&#xe6f9;</ss-icon>
              <text style="font-size:25px;color:orange">出发地</text>
              <text class="text-content" @click="navAddress(da)">{{da.building}}</text>
          </div>
          <div v-if="da.building2 && da.building2!=''" style="display:flex;flex-direction: row;justify-content:center;align-items: center;">
              <ss-icon type="fontsumslack" color="#56bdad" :size="50">&#xe6f9;</ss-icon>
              <text style="font-size:25px;color:orange">目的地</text>
              <text class="text-content" @click="navAddress2(da)">{{da.building2}}</text>
          </div>
          <wxc-rich-text :config-list="daDesc(da)"></wxc-rich-text>
      </div>
      <div class="preview-container" v-if="da.imgList.length>0">
            <image :src="img.simg" v-for="img in da.imgList" @click="previewImage(img.img,da.imgList)" :key="img.simg" style="width:170px;height:170px;margin-right:10px"></image>
      </div>  
      <div class="card-footer" style="margin-top:15px;">
          <text class="text-grey">{{da.createTime}}</text>
          <ss-icon type="fontsumslack" :ref="'btnDa_'+da.id" @click.native="dayixia(da.id)" color="#56bdad" :size="50">{{da.daFill?'\ue708':'\ue709'}}</ss-icon>
          <text ref="daIcon" @click="dayixia(da.id)" class="text-grey pr20">搭一下{{da.numDaNum>0?'('+da.numDaNum+')':''}}</text>
          <ss-icon type="fontsumslack" @click.native="goComment(da.id)" color="#56bdad" :size="50">&#xe721;</ss-icon>
          <text @click="goComment(da.id)" class="text-grey pr20">评论{{da.numComment>0?'('+da.numComment+')':''}}</text>
      </div>
  </div>
</template>
<style scoped>
  .wxc-item {
    width: 750px;
    height: 246px;
    flex-direction: row;
  }
  .item-image {
    width: 198px;
    height: 198px;
    margin-top: 24px;
    margin-left: 24px;
    margin-bottom: 24px;
    margin-right: 24px;
    border-radius: 100px;
  }
  .image-desc {
    position: absolute;
    left: 24px;
    top: 186px;
    width: 198px;
    height: 36px;
    background-color: rgba(0, 0, 0, .8);
    align-items: center;
    justify-content: center;
  }
  .image-text {
    font-size: 24px;
    color: #ffffff;
  }
  .item-content {
    flex: 1;
    border-bottom-width: 1px;
    border-bottom-color: #e0e0e0;
    border-bottom-style: solid;
    justify-content: space-between;
    padding-top: 24px;
    padding-right: 24px;
    padding-bottom: 18px;
  }
  .item-text {
    font-size: 30px;
    line-height: 40px;
    color: #333333;
    font-weight: bold;
    lines: 2;
    text-overflow: ellipsis;
  }
  .item-price {
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    height: 36px;
  }
  .price-num {
    flex-direction: row;
    align-items: center;
  }
  .yen {
    color: #FF5E00;
    font-size: 24px;
    line-height: 26px;
    margin-right: 2px;
    margin-top: 4px;
  }
  .price {
    color: #FF5E00;
    font-size: 36px;
    line-height: 40px;
  }
  .postfix {
    font-size: 24px;
    line-height: 28px;
    color: #A5A5A5;
    margin-top: 6px;
    margin-left: 2px;
  }
  .category-tag {
    padding-right: 16px;
    padding-left: 12px;
    height: 36px;
    justify-content: center;
    border-top-right-radius: 0;
    border-bottom-right-radius: 24px;
    background-color: #FFC900;
    position: absolute;
    top: 24px;
    left: 24px;
  }
  .tag-text {
    color: #3d3d3d;
    font-size: 22px;
    line-height: 36px;
  }
    .preview-container {
        display: flex;
        flex-direction: row;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left:10px;
        margin-right: 10px;
        flex-wrap: wrap;
    }


  .card{
      background-color:rgb(254,254,254); ;
      margin-top:10px;
      display:flex;
      flex-direction: column;
      margin-bottom:10px;
      padding:15;
  }

  .card-title{
      background-color: ;
      display:flex;
      flex-direction: row;
      align-items: center;
      align-content: flex-start;
      justify-content: space-between;
      height:70px;
      padding-top: 10;
      padding-bottom: 10;
  }

  .card-content{
      display:flex;
      flex-direction: column;
  }
  .card-footer{
      display:flex;
      flex-direction: row;
      padding-top: 10px;
      padding-bottom: 10px;
      align-items: center;
  }
  .text-white{
      color:rgb(239,249,248);
      font-weight: 900;
  }
  .text-grey{
      color:rgb(144,144,144);
  }
  .text-title{
      color:rgb(48,48,48);
      font-weight: 900;
      font-size:35;
  }
  .text-content{
      padding: 10;
      color:rgb(145,145,145);
      flex:1;
      font-size:25px;
  }
  .text-time{
      padding-right: 5;
      color:rgb(145,145,145);
  }
  .strong{
      font-weight: 500;
  }
  .pr20{
    padding-right: 20;
  }
</style>

<script>
  import { WxcRichText, WxcSpecialRichText, Utils } from 'weex-ui';
  import SsIcon from './inc/icon.vue';
  const Sumslack = require("./sumslack/js/sumslack.js");
  const httpService = require("./sumslack/js/http-service.js");

  export default {
    components: { WxcRichText, WxcSpecialRichText,SsIcon },
    props: {
      da:{
        type:Object
      }
    },
    data: () => ({
      showCard:true
    }),
    computed: {

    },
    methods:{
      openProfile:function(uid){
        Sumslack.openProfile(parseInt(uid));
      },
      previewImage(cimg,imgList){
         let curls = [];
         imgList.forEach(item => {
             curls.push(item.img);
         })
         Sumslack.previewImage({'current':cimg,'urls':curls});
      },
      daDesc(da){
        return [{
          type: 'tag',
          value: da.city,
          theme: 'yellow',
          style:{
            fontSize: 25,
            color: '#272727',
            borderColor: '#CCCCCC',
            borderRadius:8,
            height:45
          }
        },{
          type: 'tag',
          value: da.c,
          theme: 'yellow',
          style:{
            fontSize: 25,
            color: '#272727',
            borderColor: '#CCCCCC',
            borderRadius:8,
            height:45
          }
        },{
          type: 'tag',
          value: da.dt + '集合',
          style:{
            fontSize: 25,
            color: '#FB8A83',
            borderColor: '#CCCCCC',
            borderRadius:8,
            height:45
          }
        }];
      },
      showMoreAction:function(da){
          var did = da.id;
          var createor = da.uid;
          var that = this;
          Sumslack.getUserInfo().then( userInfor => {
              var _uid = userInfor.id;
              var _menuItems = [];
              if(parseInt(_uid) === parseInt(createor)){
                  _menuItems = ["分享...","搭伙列表","目的地导航","删除"];
              }else{
                  _menuItems = ["分享...","目的地导航"];
              }
              Sumslack.showActionSheet({"itemList":_menuItems},function(ret) {
                  var _action = _menuItems[ret];
                  switch(_action){
                      case "分享...":
                          Sumslack.shareWeixin("来自 "+userInfor.nick+" 的搭伙邀请","http://192.168.1.154:7080/invite/"+da.id, "[ "+ da.c+" ] "+ da.d + "\n  " + da.addr + "出发 " + da.dt + "集合");
                          break;
                      case "搭伙列表":
                          Sumslack.navigateTo("page.dalist",{"fid":did});
                          break;
                      case "目的地导航":
                          that.navAddress(da);
                          break;
                      case "删除":
                          Sumslack.confirm("是否确定删除？不可恢复哦~",function(ok){
                              if(ok === "OK"){
                                  httpService.daziRemove(did,function(json){
                                      if(json.ret){
                                          //that.refreshDzItemRemove(did);
                                          //var _thisCard = this.$refs["dacard_"+that.da.id];
                                          that.showCard = false;
                                      }else{
                                          Sumslack.alert(json.msg);
                                      }
                                  });
                              }
                          });
                          break;
                  }
              });
          });
      },
      //打开地址以便导航
      navAddress:function(da){
            Sumslack.openLocation(da.lat+"",da.lot+"",da.building,da.addr);
      },
      navAddress2:function(da){
            Sumslack.openLocation(da.lat2+"",da.lot2+"",da.building2,da.addr2);
      },
      dayixia:function(id){
          var that = this;
          var testEl = this.$refs["btnDa_"+id];
//            animation.transition(testEl, {
//                styles: {
//                    //transform: 'scale(2)',
//                    //opacity:0
//                    backgroundColor:"#0000FF"
//                },
//                duration: 800, //ms
//                timingFunction: 'ease-in-out',
//                delay: 0 //ms
//            }, function () {
//
//            });
          httpService.dayixia(id,function(json){
              if(json.ret){
                  that.da.daFill = json.da.daFill;       
                  that.da.numDaNum = json.da.numDaNum;           
              }else{
                  Sumslack.alert(json.msg);
              }
          });
      },
      goComment:function(did){
          Sumslack.navigateToEmojiPanel("评论列表","请输入评论","page.comment",{"fid":did});
          //Sumslack.navigateTo("page.comment",{"fid":did});
      }
    }
  };
</script>