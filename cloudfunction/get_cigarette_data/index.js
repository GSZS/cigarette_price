// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({ env: "填入环境id" }); // 使用当前云环境
let db = cloud.database();

/**
 * @description 云函数入口函数
 * @param event 接收调用接口时上传的参数，类型是对象
 */
exports.main = async (event) => {
  let moreControls = {
    // 获取口粮类别
    getCate: async () => {
      let data = await db
        .collection("cigarette_type")
        .doc("14a8deea64c3258200cf31c36ffd9aaf")
        .get();
      return data;
    },

    // 获取口粮类别对应的数据
    getCigaretteData: async ({ name }) => {
      let data = await db
        .collection("cigarette_info")
        .where({
          type: name,
        })
        .get();
      return data;
    },
  };

  // event.args是小程序端传入的实质性参数，useName这个小程序端传入的参数只是用于选择使用哪个接口，以实现一个云函数抛出多个接口
  return moreControls[event.useName](event.args);
};
