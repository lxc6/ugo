// 统一请求封装
import Vue from 'vue'
Vue.prototype.$http=async function(option){
    const baseURL = "https://www.uinav.com/api/public/v1"
    uni.showLoading({
        title: '加载中...',
        mask:true
    });
    let res = await uni.request({
        url:baseURL+option.url,
        method:option.method?option.method:"get",
        haeder:option.haeder?option.haeder:{},
        data:option.data?option.data:{}
    })
    uni.hideLoading();
    return res[1].data
}
