<template>
  <view class="wrapper">
    <!-- 商品图片 -->
    <swiper
      autoplay
      class="pics"
      indicator-dots
      indicator-color="rgba(255, 255, 255, 0.6)"
      indicator-active-color="#fff"
    >
      <swiper-item v-for="item in detail.pics" :key="item.pics_id">
        <image :src="item.pics_big" />>
      </swiper-item>
    </swiper>
    <!-- 基本信息 -->
    <view class="meta">
      <view class="price">￥{{detail.goods_price}}</view>
      <view class="name">{{detail.goods_name}}</view>
      <view class="shipment">快递: 免运费</view>
      <text class="collect icon-star">收藏</text>
    </view>
    <!-- 商品详情 -->
    <view class="detail">
      <!-- 转换为html结构 -->
      <!-- <view v-html="goods.goods_introduce"></view> -->
      <rich-text :nodes="goods.goods_introduce"></rich-text>
    </view>
    <!-- 操作 -->
    <view class="action">
      <!-- <button open-type="getPhoneNumber">获取手机号-我们的账号没有权限</button> -->
      <!-- <button open-type="getUserInfo">获取个人微信信息-后面</button> -->
      <button open-type="contact" class="icon-handset">联系客服</button>
      <text class="cart icon-cart" @click="goCart">购物车</text>
      <text class="add" @click="addCarts">加入购物车</text>
      <text class="buy" @click="createOrder">立即购买</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detail: null,
      carts: uni.getStorageSync("carts") || []
    };
  },
  onLoad(params) {
    this.getDetail(params.id);//传入id
  },
  methods: {
    // 添加到购物车
    addCarts() {
      console.log("goods当前商品", this.detail);
      // 信息太多取出重要的存起来 商品id 商品价格price  商品购买数量（默认1） 商品标题 商品小图片goods_small_logo
      let { goods_id, goods_price, goods_name, goods_small_logo } = this.detail;
      // 判断商品是否为重复购买
      let index = this.carts.findIndex(
        item => item.goods_id === this.detail.goods_id
      );
      if (index === -1) {
        this.carts.push({
          goods_id,
          goods_price,
          goods_name,
          goods_small_logo,
          goods_number: 1, // 默认加一
          goods_checked: true // 在购物车页面 需要 通过他 来判断  是否选中
        });
      } else {
        //有这个商品 数量 +1
        this.carts[index].goods_number += 1;
      }
      // 添加到缓存
      uni.setStorageSync("carts", this.carts);
      // 提示添加成功
      uni.showToast({
        title: "加入购物车成功"
      });
    },
    // 获取商品详情数据
    async getDetail(id) {
      let res = await this.$http({
        url: "/goods/detail",
        data: { goods_id: id }
      });
      console.log("参数为", res);
      this.detail = res.message;
    },
    // 跳转到购物车
    goCart() {
      uni.switchTab({
        url: "/pages/cart/index"
      });
    },
    // 付款
    createOrder() {
      uni.navigateTo({
        url: "/pages/order/index"
      });
    }
  }
};
</script>

<style scoped lang="less">
.wrapper {
  margin-bottom: 100rpx;
  background-color: #f4f4f4;
}

.pics {
  height: 640rpx;
}

.meta {
  height: 250rpx;
  line-height: 1;
  padding: 30rpx 180rpx 30rpx 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  position: relative;

  .price {
    font-size: 36rpx;
    color: #ea4451;
    margin-bottom: 20rpx;
  }

  .name {
    color: #333;
    line-height: 1.4;
    font-size: 33rpx;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .shipment {
    font-size: 27rpx;
    color: #999;
    position: absolute;
    bottom: 30rpx;
  }

  .collect {
    width: 140rpx;
    height: 88rpx;
    text-align: center;
    box-sizing: border-box;
    border-left: 1rpx solid #ddd;
    font-size: 24rpx;
    color: #999;

    position: absolute;
    right: 10rpx;
    top: 91rpx;
  }

  [class*="icon-"]::before {
    display: block;
    font-size: 45rpx;
    margin-bottom: 10rpx;
  }
}

.detail image {
  width: 100%;
  height: 480rpx;
  margin-top: 20rpx;
}

.action {
  width: 100%;
  height: 98rpx;
  background-color: #fff;

  position: fixed;
  left: 0;
  bottom: 0;

  display: flex;
  align-items: center;

  text {
    display: block;
  }

  .add,
  .buy {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 210rpx;
    text-align: center;
    font-size: 27rpx;
    color: #fff;
  }

  .add {
    background-color: #f4b73f;
  }

  .buy {
    background-color: #ea4451;
  }

  button {
    padding: 0;
    border-radius: 0;
    background-color: #fff;

    &::after {
      border: none;
    }
  }

  button,
  .cart {
    flex: 1;
    text-align: center;
    color: #989898;
    font-size: 24rpx;
    box-sizing: border-box;
  }

  [class*="icon"]::before {
    display: block;
    font-size: 45rpx;
    margin-bottom: 2rpx;
  }
}
</style>
