# cigarette_price
查询香烟价格的微信小程序
### 介绍

<aside>
📖 此Page介绍关于微信小程序云开发所用到的知识

</aside>

### 开通微信云开发

点击此[链接](https://mp.weixin.qq.com/wxamp/cloudservice/cloudrun)然后，登陆小程序后台管理

### 创建云开发环境

1. 打开微信开发者工具，点击云开发
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/065f803a-496c-4b75-90a3-e9c0b45582b7/Untitled.png)
    
2. 根据对话框提示，创建云环境
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/514128b4-ed26-4854-b003-08ce3c65c6e4/Untitled.png)
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a1c12311-1da6-4c41-8d4b-e38611946f94/Untitled.png)
    

### 创建数据库

1. 创建集合，修改集合权限
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d404dec1-f2e8-40a9-8dc9-328e6849c6ae/Untitled.png)
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/26451b4d-26b0-4278-aab3-6efca3e1977f/Untitled.png)
    
    ---
    
2. 导入数据
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c2a39f3b-3ad6-4e5e-865c-60483b81529e/Untitled.png)
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/20a570ef-60fd-4c35-a1b2-55e23110f739/Untitled.png)
    
    <aside>
    ❗ 导入mongodb导出的数据或标准的json数据会出现如下错误
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/12a800a0-f7e1-496e-8cf9-62e07e6fa13f/Untitled.png)
    
    🔺这是因为云数据要求的json每一项之间不允许出现逗号，如下示例
    
    ---
    
    ```json
    // 错误
    {
      "cigarette_place": "湖南省"
    },
    {
      "cigarette_place": "广东省"
    }
    
    // 正确
    {
      "cigarette_place": "湖南省"
    }
    {
      "cigarette_place": "广东省"
    }
    ```
    
    </aside>
    

### 创建云函数

1. 打开**project.config.json**文件，然后添加云函数配置
    
    ```json
    {
    	...
    	"cloudfunctionRoot": "cloudfunction/",
    	"cloudfunctionTemplateRoot": "cloudfunctionTemplate/"
    	...
    }
    ```
    
    ---
    
2. 并在根目录下创建名为**cloudfunction**的文件夹
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5c1f70d3-4f9e-4690-a2ca-07dc88845b11/Untitled.png)
    
    ---
    
3. 进入微信开发者工具，然后右键**cloudfunction**，选择新建云函数，命名为get_cigarette_data。建好后会自动创建模版，如下图所示：
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cd9d575e-2e15-40ec-8093-97bb2b742bf1/Untitled.png)
    
    ---
    
4. 云函数结构
    
    ```bash
    .
    ├── config.json.    # 云函数的配置
    ├── index.js        # 云函数核心文件，入口
    ├── node_modules
    ├── package.json
    └── pnpm-lock.yaml
    ```
    
    以下是**index.js的内容，我们定义了2个接口，分别是**`getCate`跟`getCigaretteData`。用于与云数据库交互获取数据然后将数据返回给小程序端
    
    ```jsx
    // 云函数入口文件
    const cloud = require("wx-server-sdk");
    cloud.init({ env: "xxxx" }); // 初始化云函数环境
    let db = cloud.database();   // 连接云数据库
    
    /**
     * @description 云函数入口函数
     * @param event 接收调用接口时上传的参数，类型是对象
     */
    exports.main = async (event) => {
      let moreControls = {
        // 获取口粮类别
        getCate: async () => {
          let data = await dbi
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
    ```
    
    ---
    
    <aside>
    💡 在get_cigarette_data中的任何文件都是云函数文件，所以更新/添加/删除这些文件需要在微信开发者工具中进行相应的更新操作
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5516b016-91a3-46dd-9201-5af0e151a743/Untitled.png)
    
    </aside>
    
    ---
    
5. 可以通过云开发控制台查看这个云函数
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/64ad376a-0827-44df-be26-cc22dc9d7375/Untitled.png)
    

### 调试云函数

1. 启动云函数调试
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/01324e56-1b5b-42cd-88c1-2fcad9c4e39d/Untitled.png)
    
    ---
    
2. 出现这个错误“node modules未安装”
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0c096897-456a-4c4b-8ade-da727d1349d2/Untitled.png)
    
    解决方法：在本机终端进入**cloudfunction/get_cigarette_data**目录执行下`pnpm install`（作者使用的包管理工具是pnpm）命令安装package.json中的依赖包
    
3. 正常打开的界面
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2ccd1e25-fe5d-4bbe-8f40-8aebbb784d5f/Untitled.png)
    

### 在小程序端调用云函数

1. 在**app.js**中初始化云函数
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ca29ec3c-f235-4a59-9a41-3202b7bcd523/Untitled.png)
    
    ```tsx
    wx.cloud.init({
      env: "xx", // xx是开通云开发时的环境id，可以通过开发者工具中的云开发控制台查看
    });
    ```
    
    ---
    
2. 在首页测试对云函数的调用，如下示例是测试获取云数据库中的数据
    
    ```jsx
    wx.cloud
    .callFunction({
    	// name是云函数的名称，要与创建云函数时对应
      name: "get_cigarette_data",
    	// 调用云函数中的接口传输的参数
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
    ```
    
    <aside>
    💡 想了解更多关于云数据库的操作方法可以点击如下链接
    
    [云数据库操作](https://www.notion.so/5ea79dac7f054e7abcd75f708449aaff?pvs=21)
    
    </aside>
    

### 扩展

微信云开发

[微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)