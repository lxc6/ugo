<template>
  <view>
    <!-- 有 open-type 可以实现各种功能 --- 客服contact 反馈 feedback 
                                                            bindtap
                              getUserInfo	获取用户信息，
    可以从bind getuserinfo 事件函数中获取到用户信息-->
    <!-- 点击登录 
          1 调用微信特有方法 获取到我们的  微信账号信息
          2 用 我们账号去  登录
          3 登录成功  storage存 token
    -->
    <button type="primary" @getuserinfo="getUser" open-type="getUserInfo">微信登录</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      token: ""
    };
  },
  methods: {
    async getUser(user) {
      // console.log("用户信息", user);
      if (user.detail.errMsg === "getUserInfo:fail auth deny") {
        uni.showToast({
          title: "不允许获取信息,将无法进行重要操作哦~",
          icon: "none"
        });
        return
      }
      //1  允许  调用微信特有方法 获取到我们的  微信账号信息 
      // 2 用 我们账号去  登录--还需要code(小程序登录都需要)
      let res = await uni.login()
      console.log('用户数据',res);
      
    }
  },
  onLoad() {}
};
</script>

<style lang="less" scoped>
button {
  width: 600rpx;
  margin: 200rpx auto 0;
}
</style>