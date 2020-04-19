// 封装search组件
<template>
  <view class="search" :class="{ active: isfocus }">
    <!-- 搜索框 -->
    <view class="search_input">
      <!-- 文本框里面回车 小程序文本框自带回车事件 confirm -->
      <input
        @focus="goSearch"
        v-model.trim="value"
        @input="query"
        @confirm="goList"
        type="text"
        placeholder="请输入搜索商品"
      />
      <text @click.stop="goCancel" class="cancel">取消</text>
    </view>
    <!-- 搜索结果 -->
    <view class="search_result">
      <!-- X 清空历史 -->
      <view class="title">
        <span @click="clearHistory" class="clear"></span>
      </view>
      <!-- 历史记录 -->
      <view class="history">
        <navigator :url="'/pages/list/index?query='+item" v-for="(item, index) in history" :key="index">{{ item }}</navigator>
      </view>
      <!-- 搜索结果 -->
      <scroll-view scroll-y class="result" v-if="list.length>0">
        <navigator 
        url="/pages/goods/index" 
        v-for="item in list" 
        :key="item.goods_id">{{item.goods_name}}</navigator>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isfocus: false,
      value: "", //文本框的值
      list: [], //索索结果
      // 历史记录 有取出storage 没有为[]
      history: uni.getStorageSync("history") || []
    };
  },
  onLoad(){
    
  },
  methods: {
    // 转到商品列表页
    goList() {
      if (this.value) {
        this.history.push(this.value);
        this.history = [...new Set(this.history)]; //去重
        console.log(this.history);
        uni.setStorageSync("history", this.history); //存入本地缓存
        //跳转到商品列表页 并携带参数
          uni.navigateTo({
          url: "/pages/list/index?query=" + this.value
        });
       }
       else {
        uni.showToast({
          title: "搜索内容不能为空！",
          icon:'none'
        });
      }
    },
    // 清除历史记录
    clearHistory() {
      // 判断是否要清空
      uni.showModal({
        title: "清空历史",
        content: "你确定要清空历史记录吗？",
        success: res => {
          if (res.confirm) {
            this.history = [];
            uni.removeStorageSync("history");
            // 提示清除成功
            uni.showToast({
              title: "删除成功！"
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    // 获取搜索数据
    query() {
      let that = this;
      // 防抖
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {      
          let res = await that.$http({
          url: "/goods/qsearch",
          data: { query: that.value }
        });
        console.log(res);
        that.list = res.message;
      }, 500);
    },
    // 进入搜索
    goSearch() {
      // console.log("123");
      this.isfocus = true;
      //   获取可用屏幕高度
      const res = uni.getSystemInfoSync();
      let height = res.windowHeight + "px";
      this.$emit("my", height);
    },
    //退出搜索
    goCancel() {
      this.value='',//清空输入内容
      this.list=[],//清空搜索列表
      this.isfocus = false;
      this.$emit("my", "auto");
      // 显示tabBar
      uni.showTabBar()
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
    flex: 1;
    padding: 27rpx;
    background-color: #fff;
    position: relative;

    .title {
      font-size: 27rpx;
      line-height: 1;
      color: #333;
    }

    .clear {
      display: block;
      width: 27rpx;
      height: 27rpx;
      float: right;
      background-image: url(http://static.botue.com/ugo/images/clear.png);
      background-size: cover;
    }

    .history {
      padding-top: 30rpx;

      navigator {
        display: inline-block;
        line-height: 1;
        padding: 15rpx 20rpx 12rpx;
        background-color: #ddd;
        font-size: 24rpx;
        margin-right: 20rpx;
        margin-bottom: 15rpx;
        color: #333;
      }
    }

    .result {
      // display: none;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: #fff;

      navigator {
        line-height: 1;
        padding: 20rpx 30rpx;
        font-size: 24rpx;
        color: #666;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }
      }
    }
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
