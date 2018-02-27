<template>
    <scroller>
    <div class="container">
        <div @click="selectCategory()"><bui-tip type="default" value="不限"></bui-tip></div>
        <div :key="c.id" v-for="c in daCateList">
            <bui-tip type="info" :value="c.title"></bui-tip>
            <div class="tabbar-container">
                <div class="tabbar-item" :key="cc.id" @click="selectCategory(cc)" v-for="cc in c.children">
                    <ss-icon color='#1296db' :size=80 :name="cc.icon"></ss-icon>
                    <text>{{cc.title}}</text>
                </div>
            </div>
        </div>
    </div>
    </scroller>
</template>
<style src='./css/sumslack.css' />
<style>
    .tabbar-container{
        display:flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        background-color: #fff;
        margin-top: 5px;
        margin-bottom: 5px;
        padding-bottom:15px;
    }
    .tabbar-item{
        margin-top:20px;
        width: 180px;
        display:flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
</style>

<script>
    import SsIcon from './inc/icon.vue';
    const config = require("./sumslack/js/config.js");
    const Sumslack = require("./sumslack/js/sumslack.js");
    const domModule = weex.requireModule('dom');
    export default {
        data: {
            action:"",
            daCateList:[
                {id:"3",title:"户外",icon:"icon-huwai",children:[
                    {id:"51",title:"爬山",icon:"icon-pashan"},
                    {id:"9",title:"钓鱼",icon:"icon-diaoyu"},
                    {id:"27",title:"烧烤",icon:"icon-shaokao"},
                    {id:"10",title:"骑行",icon:"icon-cycling"},
                    {id:"11",title:"跑步",icon:"icon-icon6"},
                    {id:"12",title:"羽毛球",icon:"icon-yumaoqiu"},
                    {id:"13",title:"篮球",icon:"icon-qiu"},
                    {id:"14",title:"乒乓球",icon:"icon-PingPong"},
                    {id:"15",title:"网球",icon:"icon-wangqiu"},
                    {id:"16",title:"足球",icon:"icon-zuqiu"},
                    {id:"17",title:"游泳",icon:"icon-youyong"}
                ]},
                {id:"1",title:"休闲娱乐",icon:"icon-yule",children:[
                    {id:"19",title:"棋牌",icon:"icon-qipai"},
                    {id:"20",title:"KTV",icon:"icon-ktv"},
                    {id:"21",title:"桌游",icon:"icon-zhuoyou"},
                    {id:"22",title:"密室",icon:"icon-mishitaotuo"},
                    {id:"23",title:"会所/夜总会",icon:"icon-huisuo"},
                    {id:"24",title:"泡吧",icon:"icon-jiuba2"},
                    {id:"25",title:"演唱会",icon:"icon-yanchanghui"}
                ]},
                {id:"2",title:"健身",icon:"icon-jianshen",children:[
                    {id:"28",title:"健身中心",icon:"icon-jianshen1"},
                    {id:"29",title:"瑜伽",icon:"icon-yuqie"},
                    {id:"30",title:"美容",icon:"icon-meirong"},
                    {id:"31",title:"足浴洗浴",icon:"icon-zuyu"}
                ]},
                {id:"5",title:"顺风车",icon:"icon-shunfengche",children:[
                    {id:"5",title:"顺风车",icon:"icon-shunfengche"}
                ]},
                {id:"4",title:"聚餐",icon:"icon-jucan",children:[
                    {id:"32",title:"别墅聚餐",icon:"icon-bieshu"},
                    {id:"33",title:"AA聚餐",icon:"icon-jucan1"}
                ]},
                {id:"6",title:"旅游",icon:"icon-lvyou",children:[
                    {id:"34",title:"周边游",icon:"icon-zhoubianyou"},
                    {id:"35",title:"农家乐",icon:"icon-nongjiale"},
                    {id:"36",title:"温泉",icon:"icon-wenquan"},
                    {id:"37",title:"踏青采摘",icon:"icon-caizhai"}
                ]},
                {id:"7",title:"共享",icon:"icon-pin",children:[
                    {id:"39",title:"团购/拼团",icon:"icon-pin"},
                    {id:"71",title:"厨房",icon:"icon-danshenpaidui"}
                ]}
            ]
        },
        components: {
          SsIcon
        },
        created () {
            this.action = Sumslack.getHttp().getUrlParam(this,"action") || "";
        },
        methods: {
          update: function (e) {
              this.target = 'Weex'
              console.log('target:', this.target)
          },
          selectCategory:function(cc){
              if(typeof cc === "undefined"){
                  cc = {id:"",title:"",icon:""};
              }
              if(this.action == "indexSearch"){
                  Sumslack.setStorage("indexCategory",cc,function(res){
                      Sumslack.close();
                  });
              }else if(this.action == "pubSelectCategory"){
                  Sumslack.setStorage("selectCategory",cc,function(res){
                      Sumslack.close();
                  });
              }
          }
      }
    }
</script>
