﻿<template>
    <div @viewappear="onshow">
            <list class="list">
                <refresh class="refresh" @refresh="onRefresh" @pullingdown="onPullingdown($event)"
                         :display="refreshing ? 'show' : 'hide'">
                    <text class="refresh-indicator">{{refreshText}}</text>
                </refresh>
                <cell :key="c.id" v-for="c in comments">
                    <div class="card">
                        <div class="card-title" style="margin-bottom:10px;">
                            <image style="margin-right:10px;border-radius:40px;width:80px;height:80px;" :src="c.create_avator"></image>
                            <text class="text-title">{{c.create_nick}}</text>
                            <div style="flex:1"></div>
                        </div>
                        <div class="card-content">
                            <!-- <richtext  style="font-size:18px;color:darkgrey;" :text="c.content"></richtext> -->
                            <text class="text-grey pr20">{{c.content}}</text>
                        </div>
                        <div class="card-footer">
                            <ss-icon type="fontsumslack" color="#bbbbbb" :size="50">&#xe76C;</ss-icon>
                            <text class="text-grey pr20">{{c.createTime}}</text>
                            <ss-icon type="fontsumslack" color="#bbbbbb" :size="50">&#xe743;</ss-icon>
                            <text class="text-grey pr20">{{c.likeNum}}</text>
                            <ss-icon type="fontsumslack" color="#bbbbbb" :size="50">&#xe721;</ss-icon>
                            <text class="text-grey pr20">回复</text>
                        </div>
                    </div>
                </cell>
                <loading class="loading" @loading="onLoading" :display="showLoading ? 'show' : 'hide'">
                    <text class="loading-indicator" v-if="showLoading">{{loadingText}}</text>
                    <loading-indicator class="indicator"></loading-indicator>
                </loading>
            </list>
    </div>
</template>
<style src='./css/sumslack.css' />
<style>
</style>

<script>
    import SsIcon from './inc/icon.vue';
    const config = require("./sumslack/js/config.js");
    const Sumslack = require("./sumslack/js/sumslack.js");
    const httpService = require("./sumslack/js/http-service.js");

    const domModule = weex.requireModule('dom')
    export default {
        data: {
            hasNext:true,
            fid:"", //搭子ID
            p:1,
            refreshing: false,
            showLoading: false,
            refreshIcon: "icon-down",
            refreshText: "下拉刷新...",
            loadingText: "加载更多数据...",
            comments:[]
        },
        components: {
          SsIcon
        },
        created () {
                var that = this;
                this.fid = Sumslack.getHttp().getUrlParam(this,"fid") || "1";
                Sumslack.addGlobalEventListener("sendMessage",function(ret){
                    httpService.addComment(that.fid,ret.content,function(json){
                        if(json.ret){
                            var _arr = [json.comment];
                            that.comments = _arr.concat(that.comments);

                            //that.comments.splice(that.comments.length+1);
                            //Vue.set(that.comments, 0, json.comment);
                        }else{
                            Sumslack.alert("评论失败，请检查网络！");
                        }
                    });
                });

                Sumslack.init("评论列表",[{"title":"刷新","href":"javascript:refreshUI"}],function(){
                    Sumslack.addGlobalEventListener("refreshUI",function(){
                        Sumslack.refresh();
                    });
                });

                this.p = 1;
                httpService.listComment(this.p,this.fid,function(page){
                    //Sumslack.alert(Sumslack.print(json));
                    that.renderList(page);
                });
        },
        methods: {
            renderList:function(page){
                //Sumslack.alert(Sumslack.print(page));
                this.hasNext = page.hasNext;
                if(page.pageNo === 1){
                    //this.comments.splice(0,this.comments.length);
                    this.comments = page.result;
                }else{
                    this.comments = this.comments.concat(page.result);
                }
                if(this.hasNext){
                    this.p = this.p + 1;
                }
            },
            onshow:function(){

            },
            "onSearch":function(e){

            },
            goCategoryPage:function(cid){
                if(cid === "8"){
                    Sumslack.navigateTo("page.category",{id:cid});
                }
                Sumslack.navigateTo("page.category",{id:cid});
            },
            doPublish:function(){
                //Sumslack.navigateTo("page.publish",{a:"test"});
            },
            "onRefresh": function (e) {
                var that = this;
                this.refreshing = true;
                this.refreshIcon = "icon-checkbox-on";
                this.refreshText = "刷新成功";
                this.p = 1;
                httpService.listComment(this.p,this.fid,function(page){
                    that.refreshing = false;
                    that.renderList(page);
                });
            },
            "onPullingdown": function (e) {
                this.refreshIcon = "icon-down";
                this.refreshText = "下拉可以刷新...";
                if (Math.abs(e.pullingDistance) > 100) {
                    this.refreshIcon = "icon-top";
                    this.refreshText = "松开即可刷新...";
                }
            },
            "onLoading": function (e) {
                var that = this;
                if (!this.hasNext) {
                    this.showLoading = false;
                    this.loadingText = '没有更多数据了'
                    return
                } else {
                    this.showLoading = true;
                    Sumslack.toast("loading");
                    this.loadingText = '加载更多数据...';

                    httpService.listComment(this.p,this.fid,function(page){
                        that.showLoading = false;
                        that.renderList(page);
                    });
                }
            }
          }
    }
</script>
