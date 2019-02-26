import Vue from 'vue';
Vue.prototype.routeIdx = 0; //记录路由索引
import Router from 'vue-router';

import { cookie, isPC } from '../assets/js/utils';
const isPCFlag = isPC();

import PC from '../views/pc';
import PCPage from './pc';

import Mobile from '../views/mobile';
import MobilePage from './mobile';

Vue.use(Router);
const route = new Router({
    routes: [
        {
            path: '/',
            name: isPCFlag ? 'PC' : 'Mobile',
            component: isPCFlag ? PC : Mobile,
            children: isPCFlag ? PCPage : MobilePage,
        },
    ],
    scrollBehavior (to, from, savedPosition) {
        return {
            x : 0,
            y : 0
        }
    },
});

//路由守衛，監聽路由變化執行判斷
route.beforeEach((to, from, next) => {
    Vue.prototype.routeIdx++;
    if (!to.name) {
        next({
            path: '/'
        });
    } else {
        let requireAuth = to.meta.requireAuth;
        if (requireAuth) {
            let token = cookie.get('token');
            if (!!token) {
                next();
            } else {
                route.push({
                    path: '/Sign',
                    query: {
                        redirect: from.fullPath
                    }
                })
            }
        } else {
            next();
        }
    }
});

export default route;
