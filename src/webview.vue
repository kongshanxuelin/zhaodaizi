<template>
  <div class="wrapper">
    <web ref="webview" style="width: 750px;" :style="{'height':height+'px'}" :src="url"
      @pagestart="onPageStart" @pagefinish="onPageFinish" @error="onError" @receivedtitle="onReceivedTitle"></web>
  </div>
</template>

<style scoped>
  .wrapper {
		flex-direction: column;

	}
	.row {
	  flex-direction: row;
	  justify-content: space-between
	}
	.button {
		color: #fff;
		background-color: #337ab7;
		border-color: #2e6da4;
		border-radius: 12px;
		padding-top: 20px;
		padding-left: 36px;
		padding-bottom: 20px;
		padding-right: 36px;
		font-size: 36px;
		text-align: center;
		font-weight: 500;
		margin-bottom: 10px;
  }
  .button-enabled {
    opacity: 1;
  }
  .button-disabled {
    opacity: 0.65;
  }
</style>

<script>
  import { Utils } from 'weex-ui';
  const Sumslack = require("./sumslack/js/sumslack.js");
  module.exports = {
    data: {
      pagestart: '',
      pagefinish: '',
      title: '',
      error: '',
      url:'',
      height:800,
      canGoBack: false,
      canGoForward: false,
    },
    created(){
      let _url = Sumslack.getHttp().getUrlParam(this,"url");
      _url = decodeURIComponent(_url);
      this.url = _url || "http://www.baidu.com";
      this.height = Utils.env.getPageHeight();
    },
    methods: {
      goBack: function() {
        var webview = weex.requireModule('webview');
        webview.goBack(this.$refs.webview);
      },
      goForward: function() {
        var webview = weex.requireModule('webview');
        webview.goForward(this.$refs.webview);
      },
      reload: function() {
        var webview = weex.requireModule('webview');
        webview.reload(this.$refs.webview);
      },
      onPageStart: function(e) {
        this.pagestart = e.url;
      },
      onPageFinish: function(e) {
        this.pagefinish = e.url;
        this.canGoBack = e.canGoBack;
        this.canGoForward = e.canGoForward;
        if (e.title) {
          this.title = e.title;
        }
      },
      onError: function(e) {
        this.error = url;
      },
      onReceivedTitle: function(e) {
        this.title = e.title;
      }
    }
  }
</script>