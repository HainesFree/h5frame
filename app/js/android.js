//安卓调用webview的js
//functionInJs: 安卓调用的方法。
//androidParams: 传递给安卓的参数
function bridgeAndroid (functionInJs, androidParams) {
	this.functionInJs = functionInJs;
	this.androidParams = androidParams;
}
bridgeAndroid.prototype = {
	register: function (bridge) {
		var self = this;
		bridge.init(function (message, responseCallback) {
			var data = self.androidParams;
			if (responseCallback) {
				responseCallback(data);
			}
		});
		bridge.registerHandler(this.functionInJs, function (data, responseCallback) {
			if (responseCallback) {
				var responseData = self.androidParams;
				responseCallback(responseData);
			}
		});
	},
	init: function () {
		var that = this;
		if (window.WebViewJavascriptBridge) {
			callback(WebViewJavascriptBridge)
		} else {
			document.addEventListener(
				'WebViewJavascriptBridgeReady'
				, function () {
					that.register(WebViewJavascriptBridge)
				},
				false
			);
		}
	}
};

