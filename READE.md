## toast
- html
	
```
	<div class="toast" :class="{'toast-open': toastClassFlag, 'toast-close': !toastClassFlag}" v-if="toastFlag">
		{{toastMsg}}
	</div>
```
- js

```
	toastClassFlag: false,
	toastFlag: false,
	toastMsg: '',
	timeout: '
	
	showToast: function (msg) {
		var self = this;
		clearTimeout(this.timeout);
		this.toastMsg = msg;
		this.toastFlag = true;
		this.toastClassFlag = true;
		this.timeout = setTimeout(function () {
			self.toastFlag = false;
			self.toastClassFlag = false;
		}, 3000);
	}
```
- css

```
	@include toastStyle('.toast');
```

## loading
- html

```
	<div class="modal-loading" v-if="loadingShow">
		<span class="load"></span>
		<p>数据加载中</p>
	</div>
```
- js

```
	loadingShow: false
```
- css

```
	@include modalLoadingStyle();
```

## 倒计时
- html
```
	<a @touchend.prevent="getVerifycode" :class="{'disabled': codeFlag}">{{codeText}}</a>
```

- js 
```
	codeText: '获取验证码',
	codeFlag: false,
	countdown: 60,
	
	settime: function () {
		var self = this;
		if (this.countdown === 0) {
			this.codeText = '获取验证码';
			this.codeFlag = false;
			this.countdown = 60;
			return;
		} else {
			this.codeFlag = true;
			this.codeText = '重新发送(' + this.countdown + ')';
			this.countdown--;
		}
		setTimeout(function () {
			self.settime();
		}, 1000);
	}
```

## 正则
```
		手机号
		reg: /^1\d{10}$/
		验证码
		pattern: /^[0-9]*$/
```
## 系统判断
```
	isAndroid_ios: function () {
		var u = navigator.userAgent,
			app = navigator.appVersion;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		return isAndroid === true ? true : false;
	
	}
```

## 安卓调js
- html
```
	<script src="/js/android.js"></script>
	<script>
		window.teacherFun = new bridgeAndroid('getAndroidParams');
		teacherFun.init();
	</script>
```
- js 
```
	teacherFun.androidParams = {
		'cooperatorId': ''
	}
```

## ios 调js
- js

```
		getAppParams: function () {
			var data = {
				"cooperatorId": this.teacherSelect.id
			};
			if (!this.isAndroid_ios()) {
				return data;
			}
		}
```
## 入口文档
- **520**
- https://h5-local.chiyue365.com/event/wx-open/{type}/{id}/sk520
- https://h5-local.chiyue365.com/event/sk520/[A-Z]{id}
- **618**
- https://h5-local.chiyue365.com/event/wx-open/{type}/{id}/e618
- https://h5-local.chiyue365.com/event/e618/[A-Z]{id}
- **自由合伙人**
- https://h5-local.chiyue365.com/event/wx-open/{type}/{id}/buddy
- https://h5-local.chiyue365.com/event/wx-open/0/35/buddy
- https://h5-ts.chiyue365.com/b0-35?code=001X5rgA17ClPf05SGeA1S6ugA1X5rgU&state=A0
- **910**
- https://h5-local.chiyue365.com/c{type}-{id}
- https://h5-local.chiyue365.com/c1-389
- https://h5-local.chiyue365.com/d1-389

 

