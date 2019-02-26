import Vue from 'vue'
import { Toast } from "mint-ui";

export const cookie = {
	set: function (name, value, hours) {
		hours = hours || 2;
		let exp = new Date();
		exp.setTime(exp.getTime() + (60 * 1000 * 60 * hours));
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	},
	get: function (name) {
		let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg)) {
			return unescape(arr[2]);
		} else {
			return null;
		}
	},
	del: function (name) {
		let exp = new Date();
		exp.setTime(exp.getTime() - 1);
		let cval = this.get(name);
		if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
}

//消息提示
export const messageTips = function (str, type) {
	if (str == 'TOKEN_FAILED') {
		cookie.del('token');
		window.location.reload();
		return false
	}
	if (Vue.prototype.isPC) {
		Vue.prototype.$message({
			message: str,
			type: type || 'success'
		})
	} else {
		Toast({
			message: str,
			className: 'mb-toast'
		})
	}
}

//确认信息
export const sureTips = function (title, content, sure, cancel, fn) {
	if(Vue.prototype.isPC){
		Vue.prototype.$confirm(content, title, {
			confirmButtonText: sure,
			cancelButtonText: cancel,
			type: 'warning'
		}).then(res => {
			if(res == 'confirm'){
				fn;
			}
		}).catch(() => {

		});
	}
}

//判断用户是用手机打开还是电脑打开 flag = true 电脑打开 否则就是手机
export const isPC = function () {
	let userAgentInfo = navigator.userAgent;
	let Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
	let flag = true;
	for (let v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}

//登陆之后执行
export const afterLogin = function (vueObj, token, time) {
	cookie.del("token");
	cookie.set('token', token, 2.5); //2.5小時之後過期
	vueObj.axios.defaults.headers.common['Authorization'] = "Bearer" + " " + token;
	//跳转页面
	setTimeout(function () {
		let redirect = vueObj.$route.query.redirect;
		redirect ? vueObj.$router.replace({
			path: redirect
		}) : vueObj.$router.replace({
			path: isPC() ? '/User/Vip' : '/User'
		});
	}, time);
}

//登出之后执行
export const afterExit = function (vueObj) {
	cookie.del("token");
	delete vueObj.axios.defaults.headers.common.Authorization;
	vueObj.$router.replace('/');
	vueObj.$router.go(0);
}

//转换时间的格式，变成****-**-**类型
//第二个参数 是否已经是时间对象
export const formatDate = function (dt, bol, hasTime) {
	if (dt == '' || dt == 'Invalid Date' || !dt || dt == 0 || dt == '0') {
		return ''
	}
	let date = bol ? dt : new Date(parseInt(dt * 1000));
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let hours = date.getHours();
	let minu = date.getMinutes();
	let seconds = date.getSeconds();
	if (month < 10) month = '0' + month;
	let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	if(hours < 10) hours = '0' + hours;
	if(minu < 10) minu = '0' + minu;
	if(seconds < 10) seconds = '0' + seconds;
	if (hasTime) {
		return year + '-' + month + '-' + day + ' ' + hours + ':' + minu + ':' + seconds;
	} else {
		return year + '-' + month + '-' + day;
	}
}

//英文格式下的月份
export const formatDateMonth = function (month) {
	let months;
	switch (month) {
		case 1:
			months = 'January';
			break;
		case 2:
			months = 'February';
			break;
		case 3:
			months = 'March';
			break;
		case 4:
			months = 'April';
			break;
		case 5:
			months = 'May';
			break;
		case 6:
			months = 'June';
			break;
		case 7:
			months = 'July';
			break;
		case 8:
			months = 'August';
			break;
		case 9:
			months = 'September';
			break;
		case 10:
			months = 'October';
			break;
		case 11:
			months = 'November';
			break;
		case 12:
			months = 'December';
			break;
	}
	return months;
}
//英文下格式化時間
export const formatDateEn = function (dt) {
	if (dt == '' || dt == 'Invalid Date' || !dt || dt == 0 || dt == '0') {
		return ''
	}
	let date = new Date(parseInt(dt * 1000));
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let weekDay = date.getDay();
	let weekDays = '';
	let months = '';
	switch (weekDay) {
		case 0:
			weekDays = 'Sunday';
			break;
		case 1:
			weekDays = 'Monday';
			break;
		case 2:
			weekDays = 'Tuesday';
			break;
		case 3:
			weekDays = 'Wednesday';
			break;
		case 4:
			weekDays = 'Thursday';
			break;
		case 5:
			weekDays = 'Friday';
			break;
		case 6:
			weekDays = 'Saturday';
			break;
	}
	months = formatDateMonth(month);
	return weekDays + ',' + ' ' + day + ' ' + months + ' ' + year;
}

// 事件解绑
export const removeEvent = function (element, eType,bol) {
	if(!element.eventSave) return false;
	let handleType = eType.split('.')[0];
	let handleName = eType.split('.')[1] || 'all';
	if(!element.eventSave[handleName + handleType]) return false;
	let handle = element.eventSave[handleName + handleType];
    if(element.addEventListener){
		bol = bol == undefined ? false : bol;
        element.removeEventListener(handleType, handle, bol);
    }else if(element.attachEvent){
        element.detachEvent("on"+handleType, handle);
    }else{
        element["on"+handleType] = null;
    }
}

//绑定事件
export const addEvent = function (element, eType, handle, bol) {
	if(!element.eventSave){
		element.eventSave = new Object;
	}
	let handleType = eType.split('.')[0];
	let handleName = eType.split('.')[1] || 'all';
	if(!handleType) return false;
	//如果原來有一樣的事件，就先解綁，然後給綁定新的事件
	if(element.eventSave[handleName + handleType] != undefined){
		removeEvent(element,eType);
	}
	element.eventSave[handleName + handleType] = handle;
	//如果支持addEventListener
	if (element.addEventListener) {
		bol = bol == undefined ? false : bol;
		element.addEventListener(handleType, handle, bol);
	} else if (element.attachEvent) {
		//如果支持attachEvent
		element.attachEvent("on" + handleType, handle);
	} else {
		//否则使用兼容的onclick绑定
		element["on" + handleType] = handle;
	}
}

//获取滚动条位置
export const getScroll = function () {
	if (window.pageYOffset != null) {
		//支持IE9 +
		return {
			left: window.pageXOffset,
			top: window.pageYOffset
		}
	} else if (document.compatMode == 'CSS1Compat') {
		//声明了DTD
		return {
			left: document.documentElement.scrollLeft,
			top: document.documentElement.scrollTop
		}
	}
	return {
		left: document.body.scrollLeft,
		top: document.body.scrollTop
	}
}
export const back_topTop = function (target, speed){
	let so;//每次滑动的距离
	let scrollTop = getScroll().top;
	let windowHeight =  window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;
	let documentHeight = getRect(document.body).height;

	//向上滚动
	if(scrollTop > target){
		let smallDistent = scrollTop - target;
		if(smallDistent<speed){//如果距离缩小到比控制数值小就等于控制数值
			speed = smallDistent;
		}
		so = scrollTop -= speed;
		window.scrollTo(0,so);
		if(so > target){
			var timeOut = setTimeout(function(){
				back_topTop(target, speed);
			},0);
		}
		else{
			clearTimeout(timeOut);
			return false;
		}
	}//向下滚动
	else if(scrollTop < target){
		let smallDistent = target - scrollTop;
		if(target >= documentHeight - windowHeight){ //目标在底部
			target = documentHeight - windowHeight;
		}
		if(smallDistent<speed){//如果距离缩小到比控制数值小就等于控制数值
			speed = smallDistent;
		}
		so = scrollTop += speed;
		window.scrollTo(0,so);
		if(so < target){
			var timeOut = setTimeout(()=>back_topTop(target,speed),0);
		}
		else{
			clearTimeout(timeOut);
			return false;
		}
	}
	else{
		clearTimeout(timeOut);
		return false;
	}
}

//获取对象的各种offset跟宽高
export const getRect = function (el) {
	if (!el) return false;
	let rect = el.getBoundingClientRect();
	let _left = document.documentElement.clientLeft;
	let _top = document.documentElement.clientTop;
	return {
		left: rect.left - _left,
		top: rect.top - _top,
		right: rect.right - _left,
		bottom: rect.bottom - _top,
		width: rect.right - rect.left,
		height: rect.bottom - rect.top
	}
}

//獲取對象距離瀏覽器頂部工作區的距離
export const getPositionTop = function (node) {
	if(!node){
		return 0;
	}
	let top = node.offsetTop;
	let parent = node.offsetParent;
	while (parent != null) {
		top += parent.offsetTop;
		parent = parent.offsetParent;
	}
	return top;
}

//随机生成验证码
export const createCode = function () {
	let code = "";
	let codeLength = 4;
	let random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
		'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
	for (let i = 0; i < codeLength; i++) {
		let index = Math.floor(Math.random() * 36);
		code += random[index];
	}
	return code;
}

//如果滚动条达到了页面的90%执行回调
export const scrollDistance = function (viewPortHeight, contentHeight, fn) {
	let scrollTop = getScroll().top;
	if (scrollTop + viewPortHeight >= contentHeight * 0.9) {
		fn();
	}
}

//回到顶部
export const scrollTop = function (to) {
	if (!to) to = 0;
	if (window.scrollTo) {
		window.scrollTo(0, to);
	} else {
		window.scrollTop = to
	}
}

//过滤掉html的标签，只留文字
export const filterHtml = function (str) {
	return str.replace(/<[^<>]+>/g, '');
}

//回收文件url
export const revokeObjectURL = function (url) {
	if (window.createObjectURL != undefined) {
		window.revokeObjectURL(url);
	} else if (window.URL != undefined) {
		window.URL.revokeObjectURL(url);
	} else if (window.webkitURL != undefined) {
		window.webkitURL.revokeObjectURL(url);
	}
}

//创建文件url
export const createObjectURL = function (file) {
	let url = '';
	if (window.createObjectURL != undefined) {
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) {
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) {
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}


//檢查是否電話
export const checkIsPhone = function (str) {
	return /^[0-9]*$/g.test(str)
}

//检查手机号码格式
export const checkPhoneFormat = function (str) {
	if (str.length != 11 && str.length != 8) {
		return false;
	}
	if (str.length == 8 && str[0] != '6') {
		return false;
	}
	return true;
}

//檢查是否郵箱
export const checkIsEmail = function (str) {
	return str.indexOf('@') != -1;
}

//检查是否为空字符串
export const checkIsEmpty = function (str) {
	if (str == null) return true;
	return str.toString().replace(/(^\s*)|(\s*$)/g, "") === '';
}

//去掉字符串前後的空格
export const trimString = function (str) {
	return str.toString().replace(/(^\s*)|(\s*$)/g, "");
}

//檢測密碼長度
export const checkPwdLength = function (str) {
	return str.toString().length >= 6 && str.toString().length <= 20;
}

//检测密码格式
export const checkPwdFormat = function (str) {
	return /^[0-9A-Za-z_]*$/g.test(str)
}

//获取区号
export const getAreaCode = function (Vue) {
	let arr = [
		{
			code: '86',
			value: '+86(' + Vue.$t("area.cn") + ')',
		},
		{
			code: '852',
			value: '+852(' + Vue.$t("area.hk") + ')',
		},
		{
			code: '853',
			value: '+853(' + Vue.$t("area.macao") + ')',
		},
		{
			code: '886',
			value: '+886(' + Vue.$t("area.taiwan") + ')',
		}
	];
	return arr;
}

//滾動條控制
export const scrollHanlder = {
	init: {
		keys: {
			37: 1,
			38: 1,
			39: 1,
			40: 1,
		},
		oldonwheel: null,
		oldonmousewheel1: null,
		oldonmousewheel2: null,
		oldontouchmove: null,
		oldonkeydown: null,
		isDisabled: null,
		preventDefault: function (e) {
			e = e || window.event;
			if (e.preventDefault)
				e.preventDefault();
			e.returnValue = false;
		},
		preventDefaultForScrollKeys: function (e) {
			if (scrollHanlder.init.keys[e.keyCode]) {
				preventDefault(e);
				return false;
			}
		}
	},
	disableScroll: function () {
		if (window.addEventListener) window.addEventListener('DOMMouseScroll', this.init.preventDefault, false);
		this.init.oldonwheel = window.onwheel;
		window.onwheel = this.init.preventDefault; // modern standard

		this.init.oldonmousewheel1 = window.onmousewheel;
		window.onmousewheel = this.init.preventDefault; // older browsers, IE
		this.init.oldonmousewheel2 = document.onmousewheel;
		document.onmousewheel = this.init.preventDefault; // older browsers, IE

		this.init.oldontouchmove = window.ontouchmove;
		window.ontouchmove = this.init.preventDefault; // mobile

		this.init.oldonkeydown = document.onkeydown;
		document.onkeydown = this.init.preventDefaultForScrollKeys;
		this.init.isDisabled = true;
	},
	enableScroll: function () {
		if (!this.init.isDisabled) return;
		if (window.removeEventListener)
			window.removeEventListener('DOMMouseScroll', this.init.preventDefault, false);
		window.onwheel = this.init.oldonwheel;
		window.onmousewheel = this.init.oldonmousewheel1;
		document.onmousewheel = this.init.oldonmousewheel2;
		window.ontouchmove = this.init.oldontouchmove;
		document.onkeydown = this.init.oldonkeydown;
		this.init.isDisabled = false;
	}
}

//订单状态
export const formatStatus = function (status, is_evaluation) {
	if (status == '1') {
		return this.$t('head.tripStatus.pendings');
	} else if (status == '2') {
		return this.$t('head.tripStatus.paid');
	} else if (status == '3') {
		return this.$t('head.tripStatus.cancel');
	} else if (status == '4' && is_evaluation == '0') {
		return this.$t('head.tripStatus.notEvaluated');
	} else if (status == '4' && is_evaluation == '1') {
		return this.$t('head.tripStatus.completed');
	}else if(status == '0'){
		return this.$t('head.tripStatus.deleted');
	}
}
//返回会员按钮字眼
export const vipBtnText = function (status, vip, isBtn) {
	let str = isBtn ? '.' : '.vip.'
	if (status == 'member') {
		if (vip == '0') {
			return this.$t('user' + str + 'join');
		} else if (vip == '1') {
			return this.$t('user' + str + 'renew');
		} else if (vip == '2') {
			return isBtn ? this.$t('user' + str + 'upgrade') : this.$t('user' + str + 'sure');
		}
	}
	if (status == 'super') {
		if (vip == '0') {
			return this.$t('user' + str + 'join');
		} else if (vip == '1') {
			return isBtn ? this.$t('user' + str + 'upgrade') : this.$t('user' + str + 'sure');
		} else if (vip == '2') {
			return this.$t('user' + str + 'renew');
		}
	}
}
//获取连接上面的键值
export const getParams = (key) => {
    let href = window.location.href;
    let paramsUrl = href.split('?')[1];
    if(!paramsUrl) return '';
    paramsUrl = paramsUrl.split('#')[0];
    let paramsList = paramsUrl.split('&');
    let obj = {};
    paramsList.forEach(ele => {
        let arr = ele.split('=');
        obj[arr[0]] = arr[1];
    });
    return obj[key];
}

//创建表单提交
export const createFormSubmit = (target , data) => {
	let form = document.getElementById('vt-form');
	if(form){
		form.innerHTML = '';
	}else{
		form = document.createElement('form');
  }
	form.id = 'vt-form';
	form.method = 'POST',
	form.name = 'payment';
	form.action = target;
	Object.keys(data).forEach(key => {
	  let input = document.createElement('input');
	  input.type = "hidden";
	  input.name = key;
	  input.value = data[key];
	  form.appendChild(input);
	});
	document.body.appendChild(form);
	form.submit();
}

export const isIOS = () => !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

export const isAndroid = () => navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;

//調用app的方法
export const appCallback = (method,data) => {
	if(isAndroid()){
		javascript: AndroidNativeMethod[method](data);
	}else if(isIOS()){
		window.webkit.messageHandlers[method].postMessage(data)
	}
}

//获取上个月
export const getLastMonth = () => {
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth();
	if(month === 0) {
			year--;
			month = 11;
	}else {
			month--;
	}
	return new Date(year,month,1)
}

/*
  删除节点
*/
export const removeNode = node => {
  node.parentNode.removeChild(node)
}
