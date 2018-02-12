<template>
  <div>
    <scroller class="scroller">
          <refresh class="refresh" @refresh="onRefresh" @pullingdown="onPullingdown($event)"
                         :display="refreshing ? 'show' : 'hide'">
            <text class="refresh-indicator">{{refreshText}}</text>
          </refresh>

          <div class="header">           
            <wxc-searchbar mod="hasDep"
                     :depName="city" 
                     placeholder="找找搭子吧~" 
                     @wxcSearchbarInputReturned="onSearch"
                     @wxcSearchbarDepChooseClicked="goCityPage">
            </wxc-searchbar>
          </div>

          <!-- Banner  -->
          <div class="banner">
            <slider class="slider" interval="3000" auto-play="true">
              <div class="frame" :key="img.src" v-for="img in bannerList">
                <image class="image" resize="cover" :src="img.src"></image>
              </div>
            </slider>
          </div>

          <!-- 分类 -->
          <div class="types">
            <div class="types-item" @click="goCategoryPage(c.id)" v-for="c in daCateList"
                        :key="c.id">
              <!--<image class="image-types" :src="item.ico" resize="stretch"></image> -->
              <ss-icon class="image-types" color="#56bdad" type="fontcategory" :size="80">{{c.icon}}</ss-icon>
              <text class="types-item-text">{{ c.title }}</text>
            </div>
          </div>
          
          <!-- 中间Slider
          <div class="banner2">
            <image class="image2" resize="stretch" src="http://wxapps.sumslack.com/test/meituan/b.gif"></image>
          </div>
          -->
          <!-- 分割线 -->
          <div class="line">
            <text class="line-text">—  猜你喜欢  —</text>
          </div>
          <!-- 列表 -->
          <div v-for="(da,key) in daList"
                :key="key">
            <wxc-pan-item :ext-id="'1-' + (key)" @wxcPanItemPan="wxcPanItemPan">
              <mt-item :da="da"></mt-item>
            </wxc-pan-item>
          </div>
          <loading @loading="onLoading" :display="showLoading ? 'show' : 'hide'">
              <text class="refresh-indicator" v-if="showLoading">{{loadingText}}</text>
              <loading-indicator class="indicator"></loading-indicator>
          </loading>
      </scroller>
  </div>
</template>
<style src='./css/sumslack.css' />
<style scoped>
  .header{
      width:750px;
      margin:0 auto;
      display: flex;
      flex-direction: row;
      background-color: rgb(86,189,173);
      align-items: center;
      align-content: center;
  }
  .banner {
    margin-top:3px;
    width: 750px;
    height: 140px;
  }
  .slider {
    border-width: 0px;
    border-style: solid;
    border-color: #41B883;
  }
  .image {
    width: 750px;
    height: 140px;
  }
  .frame {
    width: 750px;
    position: relative;
  }
</style>

<script>
  import { WxcCell,WxcSearchbar,WxcTabBar,WxcPanItem,WxcIcon,WxcLoading, Utils } from 'weex-ui';
  import MtItem from './item.vue';
  import SsIcon from './inc/icon.vue';
  import Consts from './consts'

  const Sumslack = require("./sumslack/js/sumslack.js");
  const httpService = require("./sumslack/js/http-service.js");

  export default {
    components: { WxcCell,WxcSearchbar,WxcTabBar,MtItem,WxcPanItem,WxcIcon,WxcLoading,SsIcon },
    props: {
      user:{
        type:Object
      },
      city:{
        type:String,
        default:"全国"
      }
    },
    data: () => ({
      //保留最近过滤条件
      categoryFilter:{id:"",title:"",icon:""}, 
      //过滤备选分类
      daCateList:[],

      daList:[],
      p:1,
      cateid:"",
      hasNext:true,
      refreshing: false,
      showLoading: false,
      refreshIcon: "icon-down",
      refreshText: "下拉刷新...",
      loadingText: "加载更多数据...",
      bannerList:[
        {src:'http://h5.sumslack.com/zhaodazi/banner/1.png?r=11'},
        {src:'http://h5.sumslack.com/zhaodazi/banner/2.png?r=11'}
      ]
    }),
    computed: {

    },
    mounted:function(){
      this.$nextTick(function(){
        this.$on('refreshData',function(json){
          if(json && json.city){
            this.city = json.city;
          }
          this.refreshData();
        })
      });
    },
    created () {
      var that = this;
      this.daCateList = Consts.categorys;
      httpService.listDazi(this.p,this.city,this.cateid,function(page){
        that.renderList(page);
      });
    },
    methods:{
      refreshData(){
        var that = this;
        this.p = 1;
        httpService.listDazi(this.p,this.city,this.cateid,function(page){
            that.refreshing = false;
            that.renderList(page);
        });
      },
      onRefresh: function (e) {
            var that = this;
            this.refreshing = true;
            this.refreshIcon = "icon-checkbox-on";
            this.refreshText = "刷新成功";
            this.refreshData();
      },
      onPullingdown: function (e) {
          this.refreshIcon = "icon-down";
          this.refreshText = "下拉可以刷新...";
          if (Math.abs(e.pullingDistance) > 60) {
              this.refreshIcon = "icon-top";
              this.refreshText = "松开即可刷新...";
          }
      },
      onLoading: function (e) {
          var that = this;
          if (!this.hasNext) {
              this.showLoading = false;
              this.loadingText = '没有更多数据了'
              return
          } else {
              this.showLoading = true;
              this.$emit("showLoading")
              this.loadingText = '加载更多数据...';
              httpService.listDazi(this.p,this.city,this.cateid,function(page){
                  that.showLoading = false;
                  that.renderList(page);
                  that.$emit("hideLoading")
              });
          }

      },
      goCategoryPage:function(cid){
        var that = this;
        if(cid === "8"){
            Sumslack.navigateTo("page.category",{action:"indexSearch",id:cid});
        }else{
            this.cateid = cid;
            this.p = 1;
            httpService.listDazi(this.p,this.city,this.cateid,function(page){
                that.renderList(page);
            });
        }
      },
      renderList:function(page){
          this.hasNext = page.hasNext;
          var that = this;
          if(page.pageNo === 1){
              this.daList = page.result;
          }else{
              this.daList = this.daList.concat(page.result);
          }
          if(this.hasNext){
              this.p = this.p + 1;
          }
      },
      goCityPage(){
        this.$emit("goCityPage");
      },
      onSearch(){
        this.$emit("onSearch");
      },
      wxcPanItemPan (e) {
      }
    }
  };
</script>