import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";

Vue.use(ElementUI);
Vue.prototype.$axios = axios;

import {
	dateFormat
} from './filters';
Vue.filter('dateFormat', dateFormat);
router.beforeEach((to, from, next) => {
	//路由请求前做些什么
	let timeout = localStorage.getItem('timeout', new Date().getTime());
	if(to.path == "/login") {
		next();
	} else {
		var curTime = new Date().getTime();
		console.log(timeout)
		if(timeout && (curTime - timeout) <= 1000 * 60 * 10) {
			console.log("页面没超时  不用重新登录")
			localStorage.setItem('timeout', new Date().getTime());
			next();
		} else {
			console.log("页面超时  重新登录")
			router.replace("/login")
		}
	}
})

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');