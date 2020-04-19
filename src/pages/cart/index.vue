<template>
  <view class="wrapper">
    <!-- 收货信息 -->
    <view class="shipment" v-if="address">
      <view class="dt">收货人:</view>
      <view class="dd meta">
        <text class="name">{{address.userName}}</text>
        <text class="phone">{{address.telNumber}}</text>
      </view>
      <view class="dt">收货地址:</view>
      <view class="dd">{{detailAddress}}</view>
    </view>
    <!-- 添加收货地址按钮 -->
    <button v-else class="btn" type="primary" @click="getAddress">添加收货地址</button>
    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>
        <!-- 左滑组件 -->
        <uni-swipe-action v-for="(item,index) in cartlist" :key="item.goods_id">
          <uni-swipe-action-item :options="options" @click="onClick(index,$event)">
            <view class="goods">
              <!-- 商品图片 -->
              <image class="pic" :src="item.goods_small_logo" />
              <!-- 商品信息 -->
              <view class="meta">
                <view class="name">{{item.goods_name}}</view>
                <view class="price">
                  <text>￥</text>
                  {{item.goods_price}}
                  <text>.00</text>
                </view>
                <!-- 加减 -->
                <view class="amount">
                  <text @click="reduce(index)" class="reduce">-</text>
                  <!-- number 类型只支持输入整型数字。
                  微信开发者工具上体现不出效果，请使用真机预览。-->
                  <input
                    type="number"
                    :value="item.goods_number"
                    @input="change(index,$event)"
                    class="number"
                  />
                  <text @click="plus(index)" class="plus">+</text>
                </view>
              </view>
              <!-- 选框 -->
              <view class="checkbox" @click="checked(index)">
                <icon type="success" size="20" :color="item.goods_checked?'#ea4451':'#ccc'"></icon>
              </view>
              <!-- 删除商品 -->
              <!-- <view class="del" @click="delCart(index)">删除</view> -->
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
    </view>
    <!-- 其它 -->
    <view class="extra">
      <label class="checkall">
        <icon type="success" size="20" :color="allChecked?'#ea4451':'#ccc'" @click="setAllChecked"></icon>全选
      </label>
      <view class="total">
        合计:
        <text>￥</text>
        <label>{{total}}</label>
        <text>.00</text>
      </view>
      <view class="pay" @click="pay">结算({{sum}})</view>
    </view>
  </view>
</template>

<script>
// 引入左滑组价
import uniSwipeAction from "@/components/uni-swipe-action/uni-swipe-action.vue";
import uniSwipeActionItem from "@/components/uni-swipe-action-item/uni-swipe-action-item.vue";
export default {
  // 注册组件
  components: {
    uniSwipeAction,
    uniSwipeActionItem
  },
  data() {
    return {
      options: [
        {
          text: "取消",
          style: {
            backgroundColor: "rgba(0, 200, 0, 0.3)"
          }
        },
        {
          text: "删除",
          style: {
            backgroundColor: "rgba(200, 0, 0, 0.3)"
          }
        }
      ],
      cartlist: [],
      address: null,
      token: ""
    };
  },
  methods: {
    // 左滑 点击触发
    onClick(index, e) {
      console.log(
        "当前点击的是第" + index + "个按钮，点击内容是" + e.content.text
      );
      if (e.content.text === "删除") {
        this.cartlist.splice(index, 1);
        uni.setStorageSync("carts", this.cartlist);
        uni.showToast({
          title: "删除成功"
        });
      }
    },
    //全选
    setAllChecked() {
      if (this.allChecked) {
        //点击时所有都取消勾选  赋值= 不是比较===
        this.cartlist.forEach(item => (item.goods_checked = false));
        uni.setStorageSync("carts", this.cartlist);
      } else {
        this.cartlist.forEach(item => (item.goods_checked = true));
        uni.setStorageSync("carts", this.cartlist);
      }
    },
    // 单独勾选
    checked(index) {
      this.cartlist[index].goods_checked = !this.cartlist[index].goods_checked;
      uni.setStorageSync("carts", this.cartlist);
    },
    // 输入框
    change(index, e) {
      //event事件对象获取当前的value
      let val = e.detail.value;
      val = parseInt(val); //转化类型
      // input  的type类型number只支持输入整型数字 不需要额外再添加规则
      // 微信开发者工具上体现不出效果，请使用真机预览。
      if (val <= 1) {
        val = 1;
      }
      if (val >= 11) {
        val = 10;
      }
      this.cartlist[index].goods_number = val; //替换列表数据
      uni.setStorageSync("carts", this.cartlist); //存入缓存
    },
    // 加
    plus(index) {
      let num = this.cartlist[index].goods_number;
      if (num >= 10) {
        return;
      }
      this.cartlist[index].goods_number += 1;
      uni.setStorageSync("carts", this.cartlist);
    },
    // 减
    reduce(index) {
      let num = this.cartlist[index].goods_number;
      if (num <= 1) {
        return;
      }
      this.cartlist[index].goods_number -= 1;
      uni.setStorageSync("carts", this.cartlist);
    },
    // // 删除商品
    // delCart(index) {
    //   uni.showModal({
    //     // title: "是否删除",
    //     content: "您是否要移除该商品？",
    //     success: res => {
    //       if (res.confirm) {
    //         this.cartlist.splice(index, 1);
    //         uni.setStorageSync("carts", this.cartlist);
    //         uni.showToast({
    //           title: "删除成功"
    //         });
    //       }
    //     }
    //   });
    // },
    // 添加地址  uni 自带api
    getAddress() {
      uni.chooseAddress({
        success: res => {
          // 点击确定
          console.log("地址对象", res);
          this.address = res;
        }
      });
    },
    // 模拟付款
    pay() {
      // 至少选择一件
      if (!this.checkedGoods.length) {
        uni.showToast({
          title: "请至少选择一件商品",
          icon: "none"
        });
        return;
      }
      // 填写地址
      if (!this.address) {
        uni.showToast({
          title: "请填写地址",
          icon: "none"
        });
        return;
      }
      // 判断token 有无登陆
      if (!this.token) {
        uni.showToast({
          title: "请先去登陆",
          icon: "none"
        });
        uni.navigateTo({ url: "/pages/auth/index" });
        return;
      }
    }
  },
  computed: {
    // 拼接详细地址
    detailAddress() {
      if (this.address) {
        return (
          this.address.provinceName +
          this.address.cityName +
          this.address.countyName +
          this.address.detailInfo
        );
      }
    },
    // 勾选的数量
    checkedGoods() {
      let choose = this.cartlist.filter(item => item.goods_checked === true);
      return choose;
    },
    // 判断是否为全选
    allChecked() {
      //根据两数组长度判断 返回true或false
      return this.cartlist.length === this.checkedGoods.length;
    },
    // 判断总价格
    total() {
      let total = 0;
      this.checkedGoods.forEach(goods => {
        //遍历计算总数
        total += goods.goods_number * goods.goods_price;
      });
      return total;
    },
    // 商品总件数
    sum() {
      let sum = 0;
      this.checkedGoods.filter(item => (sum += item.goods_number));
      return sum;
    }
  },
  onLoad() {
    this.token = uni.getStorageSync("token");
    // 页面打开过一次跳转(页面隐藏而非关闭) onLoad只会执一次 新加入的数据不显示
    console.log("购物车页面onLoad");
  },
  onShow() {
    console.log("购物车页面onShow");
    // onShow每次都会执行
    // 获取购物车数据
    this.cartlist = uni.getStorageSync("carts") || [];
  }
};
</script>

<style scoped lang="less">
.shipment {
  height: 100rpx;
  line-height: 2;
  padding: 30rpx 30rpx 40rpx 30rpx;
  font-size: 27rpx;
  color: #333;
  background-color: #fff;
  background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;

  .dt {
    width: 140rpx;
    float: left;
    clear: both;
  }

  .dd {
    padding-left: 160rpx;
  }

  .meta {
    padding-right: 50rpx;
  }

  text.phone {
    float: right;
  }
}

.carts {
  background-color: #f4f4f4;
  padding-bottom: 110rpx;
  overflow: hidden;

  .shopname {
    padding: 30rpx;
    margin-top: 20rpx;
    font-size: 30rpx;
    color: #333;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    border-bottom: 1rpx solid #eee;
  }

  .goods {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 100rpx;
    // margin-right: 80rpx;
    margin-top: 10rpx;
    border-bottom: 1rpx solid #eee;
    background-color: #fff;
    position: relative;

    .checkbox {
      width: 101rpx;
      height: 100%;
      background-color: #fff;

      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      left: -100rpx;
      top: 0;
    }

    &:last-child {
      border-bottom: none;
    }

    // .del {
    //   width: 60rpx;
    //   height: 100%;
    //   border-radius: 10rpx;
    //   background: rgba(200, 0, 0, 0.4);
    //   color: #fff;
    //   position: absolute;
    //   right: -70rpx;
    //   top: 0;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   padding-left: 20rpx;
    // }

    .pic {
      width: 200rpx;
      height: 200rpx;
      margin-right: 30rpx;
    }

    .meta {
      flex: 1;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      text {
        font-size: 22rpx;
      }
    }

    .amount {
      position: absolute;
      bottom: 0;
      right: 20rpx;

      height: 48rpx;
      text-align: center;
      border: 1rpx solid #ddd;
      border-radius: 8rpx;

      display: flex;
      align-items: center;

      text {
        display: block;
        width: 60rpx;
        line-height: 48rpx;
        font-size: 36rpx;
        color: #ddd;
        text-align: center;
      }

      input {
        width: 60rpx;
        height: 48rpx;
        min-height: 48rpx;
        font-size: 27rpx;
        border-left: 1rpx solid #ddd;
        border-right: 1rpx solid #ddd;
      }
    }
  }
}

.extra {
  position: fixed;
  bottom: 0;
  /* #ifdef H5 */
  bottom: 50px;
  /* #endif */
  left: 0;
  z-index: 9;

  width: 750rpx;
  height: 96rpx;
  text-align: center;
  line-height: 96rpx;
  font-size: 36rpx;
  border-top: 1rpx solid #eee;
  background-color: #fff;
  color: #333;
  display: flex;

  .checkall {
    width: 140rpx;
    line-height: 1;
    margin-left: 25rpx;
    display: flex;
    align-items: center;

    icon {
      margin-right: 20rpx;
    }
  }

  .total {
    display: flex;
    justify-content: center;
    flex: 1;

    label,
    text {
      color: #ea4451;
      vertical-align: bottom;
      position: relative;
      bottom: -2rpx;
    }

    text {
      position: relative;
      bottom: -3rpx;
      font-size: 24rpx;

      &:first-child {
        margin-left: 10rpx;
      }
    }
  }

  .pay {
    width: 200rpx;
    background-color: #ea4451;
    color: #fff;
  }
}
.btn {
  width: 40%;
  height: 80rpx;
  font-size: 30rpx;
  line-height: 80rpx;
  margin: 50rpx auto;
}
</style>

