 <template>
  <view class="list">
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>
    <!-- 商品列表 -->
    <view class="goods">
      <!--  v-for="item in list" :key="item.goods_id" -->
      <view
        class="item"
        @click="goDetail(item.goods_id)"
        v-for="item in goodlist"
        :key="item.goods_id"
      >
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
        </view>
      </view>

      <!-- 回到顶部 -->
      <view class="goTop icon-top" @click="goTop" v-if="scrollTop > 1000"></view>

      <!-- 没有更多了 -->
      <view class="last" v-show="isend">没有更多了哦~~</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      scrollTop: 0,
      goodlist: [],
      toatl: 0,
      isend: false,
      req: {
        query: "",
        pagenum: 1,
        pagesize: 20
      }
    };
  },
  onLoad(params) {
    console.log(params);
    this.req.query = params.query;
    this.getList();
  },
  methods: {
    // 回到顶部
    goTop() {
      uni.pageScrollTo({
        scrollTop: 0 // 回到 0就是顶部
      });
    },
    // 获取列表参数
    async getList() {
      let res = await this.$http({
        url: "/goods/search",
        data: this.req
      });
      console.log("请求回的数据为：", res.message.goods);
      // 不应该 替换 应该 追加合并 数据越来越多
      this.goodlist = [...this.goodlist, ...res.message.goods];
      // this.goodlist.push(...res.message.goods);
      this.toatl = res.message.total;
    },

    // 转到详情
    goDetail(id) {
      uni.navigateTo({
        url: "/pages/goods/index?id=" + id
      });
    }
  },
  // 上拉加载   在json中配置监听 在index中执行 执行函数onReachBottom
  onReachBottom() {
    console.log("拉到低了------");
    if (this.goodlist.length === this.toatl) {
      this.isend = true;
      return;
    }
    this.req.pagenum += 1;
    this.getList();
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log("开启下拉刷新,并重新发送请求渲染页面");
    this.goodlist = [];
    this.req.pagenum = 1;
    this.getList();
  },
  // 监听页面滚动
  onPageScroll(obj) {
    // console.log("页面滚动了", obj);
    this.scrollTop = obj.scrollTop;
  }
};
</script>

<style scoped lang="less">
.list {
  padding-top: 100rpx;
}
.filter {
  display: flex;
  height: 96rpx;
  line-height: 96rpx;
  border-bottom: 1rpx solid #ddd;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  background-color: #fff;

  text {
    flex: 1;
    text-align: center;
    font-size: 30rpx;
    color: #333;

    &.active {
      color: #ea4451;
    }
  }
}

.item {
  display: flex;
  padding: 30rpx 20rpx 30rpx 0;
  margin-left: 20rpx;
  border-bottom: 1rpx solid #eee;

  &:last-child {
    border-bottom: none;
  }

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
}
// 没数据时显示
.last {
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  background-color: #eee;
}
// 返回顶部
.goTop {
  position: fixed;
  z-index: 999;
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
  background-color: rgba(200, 200, 200, 0.8);
}
</style>
