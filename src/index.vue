<template>
  <wxc-tab-bar   
      :tab-titles="tabTitles"
      :tab-styles="tabStyles"
      title-type="icon"
      @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">         
      <!-- 首页Tab -->
      <div class="item-container" :style="contentStyle">
        <tab-home ref="tabHome" @goCityPage="goCityPage" @onSearch="onSearch" :city="locCity"></tab-home>
      </div>
      <!-- 同城找搭子Tab -->
      <div class="item-container" style="justify-content:center;" :style="contentStyle">
        <tab-da-city ref="tabCity"></tab-da-city>
      </div>
      <!-- 我的Tab -->
      <div class="item-container" style="justify-content:center;" :style="contentStyle">
        <tab-user :user="user"></tab-user>
      </div>
      <!-- 右下角发布搭子 -->
      <div class="_btn" v-if="btnAddShow" @click="doPublish">
            <ss-icon type="fontsumslack" :size="60" @click.native="doPublish" color="#FFFFFF">&#xe6e0;</ss-icon>
      </div>
      <!-- 城市筛选 -->
      <wxc-city 
            ref="wxcCity"
            :cityStyleType="cityStyleType"
            :currentLocation="locCity"
            :normal-list="normalList"
            :only-show-list="onlyShowList"
            :hot-list-config="hotListConfig"
            :city-location-config="cityLocationConfig"
            @wxcCityItemSelected="citySelect"
            @wxcCityOnInput="onCityInput">
      </wxc-city>
      <!-- 全局Loading -->
      <wxc-loading :show="isShow" type="trip"></wxc-loading>
  </wxc-tab-bar>               
</template>

<script>
  import { WxcCell,WxcTabBar,WxcIcon,WxcCity,WxcLoading, Utils } from 'weex-ui';
  //列表Item
  import SsIcon from './inc/icon.vue';
  import TabUser from './tab-user.vue';
  import TabDaCity from './tab-dacity.vue';
  import TabHome from './tab-home.vue';
  import Consts from './consts'

  import sourceData from './sumslack/city';
  import * as Util from 'weex-ui/packages/wxc-city/util';

  const Sumslack = require("./sumslack/js/sumslack.js");
  const httpService = require("./sumslack/js/http-service.js");

  const animation = weex.requireModule('animation');
  const domModule = weex.requireModule('dom');

  export default {
    components: { WxcCell,WxcTabBar,WxcIcon,WxcCity,SsIcon,TabUser,TabDaCity,TabHome,WxcLoading },
    data: () => ({
      //是否显示Loading
      isShow:false,
      //是否显示加号图标
      btnAddShow:true,

      //城市数据源
      sourceData:{},
      hotCityType: 'list',
      locationCityType: 'list',
      cityStyleType:'list',
      locCity:"全国",
      onlyShowList: false,

      //TabIndex当前在标签第几页
      curTabIndex:0,
      
      //当前用户信息
      user:{},
      tabTitles:Consts.tabTitles,
      tabStyles:Consts.tabStyles,
      contentStyle:""
    }),
    computed: {
      // 城市数据
      normalList () {
        return Util.getCities(this.sourceData.cities)
      },
      hotListConfig () {
        return {
          type: this.hotCityType,
          title: '热门',
          list: Util.getCities(this.sourceData.hotCity)
        }
      },
      cityLocationConfig (cc) {
        var that = this;
        return {
            type: that.locationCityType,
            title: '最近',
            list: [
              { name: that.locCity, isLocation: true }
            ]
        }
        
      }
    },
    watch:{
      locCity(val,oldVal){
        if(this.curTabIndex === 0){
          this.$refs.tabHome.$emit('refreshData',{city:val});
        }
      }
    },
    mounted(){
      // var that = this;
      // Sumslack.getLocation(data => {
      //   that.locCity = data.city;    
      // });
    },
    created () {
      var that = this;
      const tabPageHeight = Utils.env.getPageHeight();
      const { tabStyles } = this;
      this.contentStyle = { height: (tabPageHeight - tabStyles.height) + 'px' };

      this.defaultSourceData = this.sourceData;
      
      Sumslack.init("拼搭子",[{"title":"刷新","href":"javascript:refreshUI"}],function(){
        Sumslack.addGlobalEventListener("refreshUI",function(){
          Sumslack.refresh();
        });
      });

      Sumslack.getStorage("curCity",function(city){
        that.locCity = data.city;
      },function(){
      });
      //利用Sumslack登录机制，获取Sumslack账号信息同步到找搭子系统中
      Sumslack.getUserInfo().then( userInfor => {
        var _uid = userInfor.id;
        //判断是否已处于登录状态
        Sumslack.getStorage(_uid+"user",function(result){
            //TODO:这里应该检测token是否在服务端已经过期
            //Sumslack.alert(Sumslack.print(result));
            if(result.isLogined){
                //httpService.storeToken(result.token,function(){
                    //拉取列表
                    
                //});
                //获取本系统的用户信息
                httpService.getUser(function(user){
                  that.$set(that,'user',user);
                });
            }else{
                that.reLogin(userInfor);
            }
        },function(msg) {
            //Sumslack.alert("no cache infor");
            that.reLogin(userInfor);
        });
      });

    },
    methods: {
      //全局Loading
      showLoading(){
        this.isShow = true; 
      },
      hideLoading(){
        this.isShow = false; 
      },
      //所在城市选择
      citySelect(e) {
        this.locCity = e.item.cityName;
        Sumslack.setStorage("curCity",this.locCity);
      },
      onCityInput(e) {
        const { cities } = this.defaultSourceData;
        const { value } = e;
        if (value !== '' && cities && cities.length > 0) {
          const queryData = Util.query(cities, String(value).trim());
          this.sourceData = {
            cities: queryData,
            hotCity: []
          };
          this.onlyShowList = true;
        } else {
          this.sourceData = this.defaultSourceData;
          this.onlyShowList = false;
          }
      },
      onshow:function(){
            console.log("xxxx");
            // var that = this;
            // Sumslack.getStorage("indexCategory",function(result){
            //     that.categoryFilter = Sumslack.toJSON(result);
            //     that.cateid = that.categoryFilter.id;
            //     that.p = 1;
            //     Sumslack.setTitle("找搭子 - " + that.categoryFilter.title);
            //     httpService.listDazi(that.p,that.city,that.cateid,function(page){
            //         that.renderList(page);
            //     });
            // });
      },
      onSearch:function(e){
        Sumslack.toast("onserach")
      },
      goCityPage:function(){
          //Sumslack.navigateTo("page.city",{});
          this.hotCityType = 'group';
          this.locationCityType = 'group';
          this.$refs['wxcCity'].show();
      },
      goNavCategoryPage:function(){
          Sumslack.navigateTo("page.category",{action:"indexSearch",id:"8"});
      },
      reLogin:function(userInfor){
          var that = this;
          httpService.login(function (json) {
              var _uid = json.user.uid;
              json.user.isLogined = json.ret;
              Sumslack.setStorage(_uid+"user",json.user);
              if(json.user.isLogined){
                httpService.listDazi(that.p,that.city,that.cateid,function(page){
                  that.$refs.tabHome.$emit('refreshData',{city:that.locCity});
                });
              }
          });
      },
      wxcTabBarCurrentTabSelected (e) {
        const index = e.page;
        if(index == 0 || index == 1){
          this.btnAddShow = true;
        }else{
          this.btnAddShow = false;
        }
        this.curTabIndex = index;
      },
      doPublish:function(){
        Sumslack.navigateTo("page.publish",{a:"test"});
      }
    }
  };
</script>
<style scoped>
  .item-container {
    width: 750px;
    display: flex;
    flex-direction: row;
  }
  ._btn {
        display: flex;
        position: fixed;
        right: 40px;
        bottom: 150px;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
        background-color: #ff3083;
        border-radius: 50%;
        box-shadow: 1px 5px 50px 0px #ce4e81;
        z-index: 99999;
    }
</style>