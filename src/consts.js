module.exports = {
  //备选分类
  categorys: [
    { id: "3", title: "户外", icon: "\ue636" },
    { id: "1", title: "休闲娱乐", icon: "\ue615" },
    { id: "2", title: "健身", icon: "\ue5da" },
    { id: "5", title: "顺风车", icon: "\ue69a" },
    { id: "4", title: "聚餐", icon: "\ue6a8" },
    { id: "6", title: "旅游", icon: "\ue697" },
    { id: "7", title: "拼团", icon: "\ue61c" },
    { id: "8", title: "更多", icon: "\ue6a4" }
  ],
  //Tab标签
  tabTitles: [
    {
      title: '找搭子',
      icon: 'http://wxapps.sumslack.com/test/meituan/tab/home.png',
      activeIcon: 'http://wxapps.sumslack.com/test/meituan/tab/home-active.png',
    },
    {
      title: '同城搭子',
      icon: 'http://wxapps.sumslack.com/test/meituan/tab/near.png',
      activeIcon: 'http://wxapps.sumslack.com/test/meituan/tab/near-active.png'
    },
    {
      title: '我的',
      icon: 'http://wxapps.sumslack.com/test/meituan/tab/my.png',
      activeIcon: 'http://wxapps.sumslack.com/test/meituan/tab/my-active.png'
  }],
  tabStyles: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#3D3D3D',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    iconWidth: 70,
    iconHeight: 70,
    width: 160,
    height: 120,
    fontSize: 24,
    textPaddingLeft: 10,
    textPaddingRight: 10
  }
}