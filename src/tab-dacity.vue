<template>
  <div>
     <scroller class="scroller">
          <refresh class="refresh" @refresh="onRefresh" @pullingdown="onPullingdown($event)"
                         :display="refreshing ? 'show' : 'hide'">
            <text class="refresh-indicator">{{refreshText}}</text>
          </refresh>
          <!-- 分类 -->
          <div class="types">
            <div class="types-item" @click="goCategoryPage(c.id)" v-for="c in daCateList"
                        :key="c.id">
              <!--<image class="image-types" :src="item.ico" resize="stretch"></image> -->
              <ss-icon class="image-types" color="#56bdad" type="fontcategory" :size="80">{{c.icon}}</ss-icon>
              <text class="types-item-text">{{ c.title }}</text>
            </div>
          </div>
          <!-- 中间Slider -->
          <div class="banner2">
            <image class="image2" resize="stretch" src="http://h5.sumslack.com/zhaodazi/banner/3.png?r=12"></image>
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
  .image2 {
    width: 750px;
    height: 250px;
  }
  .banner2 {
    width: 750px;
    height: 250px;
  }
</style>

<script>
  import { WxcCell,WxcSearchbar,WxcTabBar,WxcPanItem,WxcIcon,Utils } from 'weex-ui';
  import MtItem from './item.vue';
  import SsIcon from './inc/icon.vue';
  import Consts from './consts';
  const Sumslack = require("./sumslack/js/sumslack.js");
  const httpService = require("./sumslack/js/http-service.js");

  export default {
    components: { WxcCell,WxcSearchbar,WxcTabBar,MtItem,WxcPanItem,WxcIcon,SsIcon },
    props: {
      user:{
        type:Object
      }
    },
    data: () => ({
      //过滤备选分类
      daCateList:[],
      daList:[],
      p:1,
      city:"宁波市",
      cateid:"",
      hasNext:true,
      refreshing: false,
      showLoading: false,
      refreshIcon: "icon-down",
      refreshText: "下拉刷新...",
      loadingText: "加载更多数据...",
    }),
    computed: {

    },
    created () {
      var that = this;
      this.daCateList = Consts.categorys;
      //先从缓存中读取定位城市
      Sumslack.getStorage("locCity",function(city){
        that.city = city;
        httpService.listDazi(that.p,that.city,that.cateid,function(page){
            that.renderList(page);
        });
      });
      Sumslack.getLocation(data => {
        that.city = data.city;
        httpService.listDazi(that.p,that.city,that.cateid,function(page){
            that.renderList(page);
        });
        Sumslack.setStorage("locCity",that.city);
      });
    },
    methods:{
      onRefresh: function (e) {
          var that = this;
          this.refreshing = true;
          this.refreshIcon = "icon-checkbox-on";
          this.refreshText = "刷新成功";
          this.p = 1;
          httpService.listDazi(this.p,this.city,this.cateid,function(page){
              that.refreshing = false;
              that.renderList(page);
          });
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
              Sumslack.toast("正在加载...");
              this.loadingText = '加载更多数据...';
              httpService.listDazi(this.p,this.city,this.cateid,function(page){
                  that.showLoading = false;
                  that.renderList(page);
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
      wxcPanItemPan (e) {
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
      }
    }
  };
</script>