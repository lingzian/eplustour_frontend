import Vue from 'vue'
import axios from 'axios'
import { cookie } from './utils'
import router from '../../router/index'

//請求的base路徑
// 测试
// axios.defaults.baseURL = "http://47.91.241.161/eplustour_test/";

// axios.defaults.baseURL = "http://47.91.241.161/eplustour";

// 正服
axios.defaults.baseURL = "https://api.eplustour.com/";

// axios.defaults.baseURL = "http://192.168.2.110/";
// axios.defaults.baseURL = "http://192.168.2.130/vt_travel";

let token = cookie.get("token");
if (token != null || token) {
    axios.defaults.headers.common['Authorization'] = "Bearer" + " " + token;
}

// 添加响应拦截器
axios.interceptors.response.use(res => {
    if (res.data.code == '1016') {
        cookie.del("token");
        delete axios.defaults.headers.common.Authorization;
        router.replace({
            path: '/Sign?redirect='+router.app.$route.fullPath
        });
    }
    if(!res){
        return Promise.reject(new Error('Error Tips: result is no defined'));
    }else {
        return res;
    }
}, error => {
    return Promise.reject(error);
});

Vue.prototype.axios = axios;

export default axios;
