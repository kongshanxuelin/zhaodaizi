module.exports = {
    //该应用在Sumslack应用商店申请时分配给你的ID
    "AppID":205,
    "pages":[
        { id: "page.index", url: "index.js" },
        { id: "page.publish", url: "publish.js" },
        { id: "page.comment", url: "comment.js" },
        { id: "page.category", url: "category.js" },
        { id: "page.city", url: "city.js" },

        { id: "page.changenick", url: "changenick.js" },
        { id: "page.changetel", url: "changetel.js" },

        { id: "page.webview", url: "webview.js" },

        { id: "page.dalist", url: "dalist.js" }
    ],
    Config:{
        notSupport: "该接口或功能仅在OpenSumslack移动端中支持！",
        //svrurl:"http://eform.sumslack.com/sumslack-zhaodazi/",
        svrurl: "http://192.168.1.154:7080/",
        DEV:true,
        //模拟登陆用户，在dev=true时有效
        testCode:"fb0e25752f27250ce114ccabe500de22",
        testUser: { 
            "avator": "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKEyBhwVLiaRdhZajRkH6MCbQCfpzCLu3bhvRRJSoYXlDdJrm8t1A9TkXXH5YVkEz04jczOTpwpN3w/0", 
            "company_id": "73", 
            "company_name": "test", 
            "nick": "空山雪林", "sex": "1", 
            "token": "fb0e25752f27250ce114ccabe500de22", id:1106,"uid": "1106", "isLogined": true }
    },
    getPageUrl:function(id){
        for(var i in this.pages){
            if(this.pages[i].id === id){
                if(this.DEV){
                    return this.pages[i].url;
                }else{
                    var _url = this.pages[i].url;
                    if(_url.endsWith(".weex.js")){
                        _url = _url.substring(0, _url.lastIndexOf(".weex")) + _url.substring(_url.lastIndexOf(".weex")+5,_url.length);
                    }
                    console.log("xxxx:",_url)
                    return _url;
                }
            }
        }
        return null;
    }
}