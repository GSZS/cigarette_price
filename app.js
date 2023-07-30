App({
  data: {
    deviceInfo: {},
  },
  onLaunch: function () {
    this.data.deviceInfo = wx.getSystemInfoSync();
    // 展示本地存储能力
    var logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);
    wx.cloud.init({
      env: "填入环境id",
    });
  },
});
