<template>
  <view class="index" :style="{ overflow: 'hidden', height: h }">
    <!-- 搜索模块 -->
    <search @my="getHeight"></search>
    <!-- 轮播图模块 -->
    <view class="swiper_box">
      <swiper
        :indicator-dots="true"
        :autoplay="true"
        indicator-active-color="rgba(255, 255, 255, .8)"
        indicator-color="rgba(0, 0, 0, .5)"
      >
        <swiper-item v-for="item in swiperlist" :key="item.goods_id">
          <!-- 跳转详情页 -->
          <navigator :url="'/pages/goods/index?id='+item.goods_id">
            <image :src="item.image_src" />
          </navigator>
        </swiper-item>
      </swiper>
    </view>
    <!-- 分类模块 -->
    <view class="navs">
      <view class="nav_cell" v-for="item in navlist" :key="item.name">
        <!-- 跳转tabbar页面，必须设置open-type="switchTab" -->
        <navigator url="/pages/category/index" open-type="switchTab">
          <image :src="item.image_src" />
        </navigator>
      </view>
    </view>
    <!-- 楼层模块 -->
    <view class="box">
      <!-- 时尚女装 -->
      <view class="f" v-for="(item, index) in floorlist" :key="index">
        <view class="bg">
          <image :src="item.floor_title.image_src" />
        </view>
        <!-- 五图区 -->
        <view class="floor">
          <navigator
            class="nav"
            :class="'nav' + (index + 1)"
            v-for="(sub, index) in item.product_list"
            :key="sub.name"
            url="#"
          >
            <image :src="sub.image_src" />
          </navigator>
        </view>
      </view>
    </view>
    <!-- 回到顶部 -->
    <view class="goTop icon-top" @click="goTop" v-if="scrollTop > 300"></view>
  </view>
</template>

<script>
import search from "@/components/search.vue";
export default {
  components: {
    search
  },
  data() {
    return {
      h: "auto",
      swiperlist: [],
      navlist: [],
      floorlist: [],
      scrollTop: 0
    };
  },
  onLoad() {
    this.getSwiper(); //轮播
    this.getNavs(); //导航
    this.getFloors(); //楼层
  },
  methods: {
    // 回到顶部
    goTop() {
      uni.pageScrollTo({
        scrollTop: 0 // 回到 0就是顶部
      });
    },
    // 接收子组件数据修改可视高度
    getHeight(height) {
      this.h = height;
    },
    // 轮播
    async getSwiper() {
      let result = await this.$http({ url: "/home/swiperdata" });
      // console.log("轮播图数据结果为", result);
      this.swiperlist = result.message;
    },
    // 分类导航
    async getNavs() {
      let result = await this.$http({ url: "/home/catitems" });
      // console.log("导航数据结果为", result);
      this.navlist = result.message;
    },
    // 楼层
    async getFloors() {
      let result = await this.$http({ url: "/home/floordata" });
      // console.log("楼层数据结果为", result);
      this.floorlist = result.message;
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log("开启下拉刷新,并重新发送请求渲染页面");
    this.getSwiper();
    this.getNavs();
    this.getFloors();
    // 等待请求完毕 应该 立刻关闭下拉效果
    uni.stopPullDownRefresh();
  },
  // 监听页面滚动
  onPageScroll(obj) {
    // console.log("页面滚动了", obj);
    this.scrollTop = obj.scrollTop;
  }
};
</script>

<style lang="less" scoped>
// 轮播模块
.swiper_box {
  swiper {
    height: 340rpx;
    navigator {
      width: 750rpx;
      height: 340rpx;
    }
  }
}
// 分类模块
.navs {
  display: flex;
  padding: 30rpx 0;
  .nav_cell {
    flex: 1;
    text-align: center;
    image {
      width: 128rpx;
      height: 140rpx;
    }
  }
}
// 楼层区域
.box {
  .f {
    .bg {
      background-color: #f4f4f4;
      padding-top: 30rpx;
      image {
        width: 750rpx;
        height: 59rpx;
      }
    }
    .floor {
      padding: 20rpx 15rpx;
      display: grid; //网格布局
      // grid-template-columns: 232rpx 232rpx 232rpx;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: 188rpx 188rpx;
      grid-gap: 15rpx; //row&column间隙
      .nav {
        width: 193rpx;
        height: 188rpx;
      }
      .nav1 {
        grid-row-start: 1;
        grid-row-end: 2;
        width: 232rpx;
        height: 386rpx;
      }
      .nav4 {
        grid-column-start: 2;
        grid-column-end: 3;
      }
      .nav2,
      .nav5 {
        width: 273rpx;
      }
      .nav5 {
        margin-left: -78rpx;
      }
    }
  }
  //单独设置第一楼图宽度
  .f:nth-child(1) {
    .floor {
      .nav {
        width: 232rpx;
      }
      .nav5 {
        margin-left: 0;
      }
    }
  }
}
// 返回顶部
.goTop {
  position: fixed;
  bottom: 30rpx;
  right: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100rpx;
  height: 100rpx;
  font-size: 48rpx;
  color: #666;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
