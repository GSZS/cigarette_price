Page({
  data: {
    navList: [],
    categoryList: [],
    goodsCount: 0,
    nowId: 0,
    list: [],
    loading: 0,
    // 搜索框输入的值
    searchValue: "",
  },
  onLoad: function (options) {},
  onShareAppMessage: function () {
    return {
      title: "口粮价格",
      desc: "便捷查询口粮的零售价格",
      path: "pages/category/index",
    };
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getCata();
    wx.hideNavigationBarLoading(); //完成停止加载
    wx.stopPullDownRefresh(); //停止下拉刷新
  },

  // 获取Tab侧边栏类目
  getCata: function () {
    wx.cloud
      .callFunction({
        name: "get_cigarette_data",
        data: {
          useName: "getCate",
        },
      })
      .then((res) => {
        this.setData({
          navList: res.result.data.name,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // 获取商品展示信息
  getCigaretteData: function (name) {
    wx.cloud
      .callFunction({
        name: "get_cigarette_data",
        data: {
          useName: "getCigaretteData",
          args: {
            name,
          },
        },
      })
      .then((res) => {
        this.setData({
          goodsCount: res.result.data.length,
          list: res.result.data,
          loading: 0,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // 搜索框
  bindinputSearch(event) {
    let v = event.detail.value;
    this.setData({
      searchValue: v,
    });
  },

  bindconfirmSearch() {
    this.data.navList.forEach((res) => {
      if (res.name == this.data.searchValue) {
        this.switchCate({
          currentTarget: {
            dataset: {
              id: res.id,
              name: res.name,
            },
          },
        });
      }
      return;
    });
  },

  onShow: function () {
    this.setData({
      loading: 1,
    });
    this.getCata();
    this.getCigaretteData("阿里山");
  },
  // 切换Tab类目
  switchCate: function (e) {
    let id = e.currentTarget.dataset.id;
    let nowId = this.data.nowId;
    if (id == nowId) {
      return false;
    } else {
      // 先重置旧数据
      this.setData({
        list: [],
        loading: 1,
        searchValue: "",
      });
      if (id == 0) {
        this.getCigaretteData("阿里山");
      } else {
        this.getCigaretteData(e.currentTarget.dataset.name);
      }
      this.setData({
        nowId: id,
        scrollTop: Math.random(),
      });
    }
  },
});
