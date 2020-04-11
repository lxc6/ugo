// 封装search组件
<template>
  <view class="search" :class="{ active:isfocus}">
    <!-- 搜索框 -->
    <view class="search_input">
      <input @focus="goSearch" type="text" placeholder="请输入搜索商品" />
      <text @click="goCancel" class="cancel">取消</text>
    </view>
    <!-- 搜索结果 -->
    <view class="search_result">
        <text> >>搜索结果 </text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isfocus: false
    };
  },
  methods: {
    goSearch() {
      // console.log("123");
      this.isfocus = true;
      //   获取可用屏幕高度
      const res = uni.getSystemInfoSync();
      let height = res.windowHeight + 'px';
      this.$emit("my", height);
    },
    goCancel() {
      this.isfocus = false;
      this.$emit("my", 'auto');
    }
  }
};
</script>

<style lang="less" scoped>
// 搜索模块
.search {
  .search_input {
    padding: 20rpx;
    background-color: #9acd32;
    input {
      height: 60rpx;
      font-size: 26rpx;
      padding-left: 26rpx;
      border-radius: 6rpx;
      background-color: #fff;
    }
    text {
      display: none;
      width: 100rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 30rpx;
      text-align: center;
      background-color: #f4f4f4;
    }
  }
  .search_result {
    display: none;
  }
  &.active {
      .search_input {
      display: flex;
      background-color: #f4f4f4;
      input {
        flex: 1;
      }
      .cancel {
        display: block;
      }
    }
    .search_result {
      display: block;
      position: absolute;
      top: 97rpx;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20rpx;
      font-size: 30rpx;
      background-color: #fff;
      z-index: 999;
    }
    
  }
}
</style>