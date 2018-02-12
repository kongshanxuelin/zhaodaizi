<template>
    <div class="container" @viewappear="onshow">
        <div>
            <textarea class="textarea" v-model="da.content" rows="5" placeholder="描述您对小伙伴的基本要求，如性别年龄技能等..."></textarea>
            <div style="display:flex;flex-direction:row;justify-content: flex-end;align-items: center;height:60px;padding-right:20px;">
                <ss-icon type="fontsumslack" :size="40" style="margin-right:5px" @click.native="doCamera">&#xe6F0;</ss-icon>
                <text @click="doCamera" class="text-grey" style="margin-right:15px">拍照</text>
                <ss-icon type="fontsumslack"  :size="40" @click="doPic" style="margin-right:5px">&#xe705;</ss-icon>
                <text @click="doPic" class="text-grey">相册</text>
            </div>
        </div>
        <div class="preview-container" v-if="da.img.length>0">
            <image :src="img" v-for="img in da.img" :key="img" style="width:170px;height:170px;margin-right:10px"></image>
        </div>    
        <wxc-cell @wxcCellClicked="selectCategory" :has-arrow="true">
            <div slot="title">
                <text class="list-title">搭子类别</text>
            </div>
            <div slot="value">
                <text class="title">{{da.category.title?da.category.title:"请选择"}}</text>
            </div>
        </wxc-cell>
        <wxc-cell :has-arrow="true">
            <div slot="title">
                <text class="list-title">搭伙时间</text>
            </div>
            <div slot="value" class="right">
                <text @click="pickDate" class="title" style="margin-right:10px;">{{da.dt!= ""?da.dt:"选择日期"}}</text>
                <text @click="pickTime" class="title">{{da.time!= ""?da.time:"选择时间"}}</text>
            </div>
        </wxc-cell>
        <wxc-cell :has-arrow="true">
            <div slot="title">
                <text class="list-title">出发集合地</text>
            </div>
            <div slot="value" @click="chooseLocation">
                <text class="title">{{da.addr.address!=""?da.addr.address:"请选择"}}</text>
            </div>
        </wxc-cell>
        <wxc-cell :has-arrow="true">
            <div slot="title">
                <text class="list-title">目标地</text>
            </div>
            <div slot="value" @click="chooseLocation2">
                <text  class="title">{{da.addr2.address!=""?da.addr2.address:"请选择"}}</text>
            </div>
        </wxc-cell>
        <wxc-cell>
            <div slot="label">
                <text class="list-title">搭伙人数</text>
            </div>
            <div slot="value" class="right" style="width:250px">
                <wxc-stepper v-model="da.num" :defaultValue="5" :min="2" :max="50"></wxc-stepper>
            </div>
        </wxc-cell>
    </div>
</template>
<style src='./css/sumslack.css' />
<style scoped>
    .textarea {
        padding-top: 25px;
        padding-left: 18px;
        padding-right: 25px;
        padding-bottom: 25px;
        color: #666666;
        border-width: 1px;
        border-style: solid;
        border-color: #666666;
        height:300px;
        background-color: #FFFFFF;
    }
    .bui-list-main{
        padding-left: 0;
        flex: 1;
        justify-content: center;
    }
    .bui-cell {
        flex-direction: row;
        align-items: center;
        height: 100px;
        border-bottom-width: 1px;
        border-bottom-color: #d7dde4;
        border-bottom-style: solid;
        background-color: rgb(254,254,254);
    }
    .right {
      flex-direction: row;
      justify-content: flex-end;
    }
    .preview-container {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        margin-left:10px;
        margin-right: 10px;
        flex-wrap: wrap;
    }
    .title{
        color: #666666;
    }
</style>
<script>
    import SsIcon from './inc/icon.vue';
    import { WxcCell,WxcStepper } from 'weex-ui';
    const domModule = weex.requireModule('dom');
    const picker = weex.requireModule('picker');
    //sumslack framework
    const config = require("./sumslack/js/config.js");
    const Sumslack = require("./sumslack/js/sumslack.js");
    const httpService = require("./sumslack/js/http-service.js");
    export default {
        data: {
            da:{
                dt:"2018-04-01",
                time:"09:38",
                content:"",
                addr:{lot:0,lat:0,address:"",city:"",building:""},
                addr2:{lot:0,lat:0,address:"",city:"",building:""},                
                num:5,
                category:{
                    id:"",
                    title:""
                },
                //附图原图列表
                img:[],  
                simg:[]
            },
        },
        components: {
          SsIcon,WxcCell,WxcStepper  
        },
        created()
        {
            var that = this;
            //默认集合时间是当天3天后
            this.da.dt = Sumslack.getTool().dateFormat(new Date(new Date().getTime()+24*3600*1000*7),"yyyy-MM-dd")
            this.da.time = Sumslack.getTool().dateFormat(new Date(),"hh:mm")

            Sumslack.init("发布搭伙需求",[{"title":"刷新","href":"javascript:refreshUI"},{"title":"发布","href":"javascript:publishDa"}],function(){
                Sumslack.addGlobalEventListener("refreshUI",function(){
                  Sumslack.refresh();
                });
                Sumslack.addGlobalEventListener("publishDa",function(){
                    var param = {
                        dt:that.da.dt,
                        time:that.da.time,
                        content:that.da.content,

                        //出发地
                        addr:that.da.addr.address,
                        building:that.da.addr.building,
                        lot:that.da.addr.lot,
                        lat:that.da.addr.lat,
                        //目标地
                        addr2:that.da.addr2.address,
                        building2:that.da.addr2.building,
                        lot2:that.da.addr2.lot,
                        lat2:that.da.addr2.lat,

                        city:that.da.addr.city || "宁波",
                        num:that.da.num,
                        cateid:that.da.category.id,
                        img:that.da.img,
                        simg:that.da.simg
                    };
                    if(param.dt == ""){
                        Sumslack.toast("请选择日期");
                        return;
                    }else if(param.time == ""){
                        Sumslack.toast("请选择时间");
                        return;
                    }else if(param.num == ""){
                        Sumslack.toast("请选择人数");
                        return;
                    }
                    else if(param.addr.address == ""){
                        Sumslack.toast("请选择地点");
                        return;
                    }
                    else if(param.content == ""){
                        Sumslack.toast("请描述需求");
                        return;
                    }
                    httpService.getDaziToken(function(token){
                        param.token = token;
                        Sumslack.request(Sumslack.getConfig().svrurl + "r/dazi/add",param).then(data => {
                            if(data.ret){
                            Sumslack.redirectTo("page.index");
                        }else{
                            Sumslack.alert("发布失败，请检查网络！");
                        }
                    });
                });

            });
        });
        },
        methods: {
            chooseLocation:function(e){
                var that = this;
                Sumslack.chooseLocation(function(data){
                    that.da.addr = data;
                });
            },
            chooseLocation2:function(e){
                var that = this;
                Sumslack.chooseLocation(function(data){
                    that.da.addr2 = data;
                });
            },
            update: function (e) {
                this.target = 'Weex'
                console.log('target:', this.target)
            },
            doCamera:function(){
                var that = this;
                if(this.da.img.length>5){
                    Sumslack.alert("最多只允许上传5张图！");
                    return;
                }
                Sumslack.chooseImage(1,1,function(res){
                    that.upload2Server(res);
                });
            },
            doPic:function(){
                var that = this;
                if(this.da.img.length>5){
                    Sumslack.alert("最多只允许上传5张图！");
                    return;
                }
                Sumslack.chooseImage(1,0,function(res){
                    that.upload2Server(res);
                    //Sumslack.alert(Sumslack.print(res));
                });
            },
            pickDate:function(event){
                picker.pickDate({
                    value: "yyyy-MM-dd"
                }, event => {
                    if (event.result === 'success') {
                        this.da.dt = event.data;
                    }
                });
            },
            pickTime:function(event){
                picker.pickTime({
                    value: "HH:mm"
                }, event => {
                    if (event.result === 'success') {
                    this.da.time = event.data;
                }
                })
            },
            selectCategory:function(){
                Sumslack.navigateTo("page.category",{action:"pubSelectCategory"});
            },
            onshow:function(){
                var that = this;
                Sumslack.getStorage("selectCategory",function(result){
                    that.da.category = Sumslack.toJSON(result);
                });
            },
            upload2Server(res){
                var that = this;
                res = Sumslack.toJSON(res);
                let _imgs = res.list;
                if(_imgs && _imgs.length === 1){    
                    Sumslack.toast("正在上传...");
                    Sumslack.uploadImage(_imgs[0],function(result){
                        result = Sumslack.toJSON(result);
                        if(result.status === "success"){
                            let remoteUrl = result.remoteUrl;
                            let remoteThumbUrl = result.remoteThumbUrl;
                            that.da.img.push(remoteUrl);
                            that.da.simg.push(remoteThumbUrl);
                            //Sumslack.alert("成功："+Sumslack.print(result));
                        }else if(result.status === "fail"){
                            Sumslack.alert("上传图像失败！");
                        }else{
                            //Sumslack.toast("正在上传..."+Math.round(result.bytesWritten*100/result.totalSize) + '%');  
                        }
                    });
                }
            }
        }
    }
</script>
