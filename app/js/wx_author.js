var wxOauth = 'https://open.weixin.qq.com/connect/oauth2/authorize';
var payAppid = 'wx99cdbf91df79b5bc';
var shareAppid = 'wx0e8e0fb231ba0ee1';
var wxDebugger = false;
var url = document.domain;
var love_outTradeNo, love_payRequest;
var mainUrl, state, webUrl = window.location.protocol + '//' + document.domain, trackUrl;
var downUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.chiyue.qiye';

if (url === 'h5-local.chiyue365.com') {
	wxDebugger = true;
	mainUrl = window.location.protocol + '//h5-local.chiyue365.com/app-h5/';
	trackUrl = window.location.protocol + '//h5-ts.chiyue365.com/app-h5/';
} else if (url === 'h5-ts.chiyue365.com') {
	wxDebugger = false;
	mainUrl = window.location.protocol + '//h5-ts.chiyue365.com/app-h5/';
	trackUrl = window.location.protocol + '//h5-ts.chiyue365.com/app-h5/';
} else if (url === 'h5-ts.chiyue365.develop') {
	wxDebugger = true;
	mainUrl = window.location.protocol + '//h5-ts.chiyue365.develop/app-h5/';
	trackUrl = window.location.protocol + '//h5-ts.chiyue365.com/app-h5/';
} else if (url === 'h5.chiyue365.com') {
	wxDebugger = false;
	mainUrl = window.location.protocol + '//h5.chiyue365.com/app-h5/';
	trackUrl = window.location.protocol + '//h5.chiyue365.com/app-h5/';
} else {
	wxDebugger = true;
	mainUrl = window.location.protocol + '//192.168.1.101:8087/app-h5/';
	trackUrl = window.location.protocol + '//h5-ts.chiyue365.com/app-h5/';
}

var getUrlPara = function (name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return (r[2]);
	return null;
};

var wxGoUrl = function (path, stateParam) {
	var appid;
	if (url === 'h5.chiyue365.com') {
		appid = payAppid;
	} else {
		appid = shareAppid;
	}
	var wxUrl = wxOauth + '?appid=' + appid + '&redirect_uri=' + encodeURIComponent(webUrl + '/' + path) + '&response_type=code&scope=snsapi_base&state=' + stateParam + '#wechat_redirect';
	return wxUrl;
};


var getWechatState = (function (urlParam, split) {
	//分隔url，传入分隔字符和分隔标识，如wx-open/1/2，返回obj，obj有type、id和拼接后的state，则结果是{type: 1, id: 2, wxState: A2}
	//wx-open/1/2 传递参数urlParam为wx-open,split为/

	var locationHref = window.location.pathname, WXstate, wxParam;
	var result = locationHref.substr(locationHref.indexOf(urlParam));
	result = result.split(split);
	var type = result[1];
	var introId = result[2];
	switch (parseInt(type)) {
		case 1:
			WXstate = 'A' + introId;
			break;
		case 2:
			WXstate = 'B' + introId;
			break;
		case 3:
			WXstate = 'C' + introId;
			break;
		case 4:
			WXstate = 'D' + introId;
			break;
		case 5:
			WXstate = 'E' + introId;
			break;
		case 6:
			WXstate = 'F' + introId;
			break;
		case 7:
			WXstate = 'G' + introId;
			break;
		case 8:
			WXstate = 'H' + introId;
			break;
		case 9:
			WXstate = 'I' + introId;
			break;
		default:
			WXstate = 'A' + 0;
	}
	return wxParam = {
		wxState: WXstate,
		referType: type,
		referId: introId
	};
});
var getReferType = function (WXstate) {
	//和setState相反，根据state换算成id。如A10，返回type为1

	if (WXstate.indexOf('A') !== -1) {
		return 1;
	} else if (WXstate.indexOf('B') !== -1) {
		return 2;
	} else if (WXstate.indexOf('C') !== -1) {
		return 3;
	} else if (WXstate.indexOf('D') !== -1) {
		return 4;
	} else if (WXstate.indexOf('E') !== -1) {
		return 5;
	} else if (WXstate.indexOf('F') !== -1) {
		return 6;
	} else if (WXstate.indexOf('G') !== -1) {
		return 7;
	} else if (WXstate.indexOf('H') !== -1) {
		return 8;
	} else if (WXstate.indexOf('I') !== -1) {
		return 9;
	}
};
var setState = function (type, introId) {
	//根据referType 和 referId 来拼接微信授权的state，如type是1，id是10，则返回A10

	var stateParam;
	var typeParam = type, introIdParam = introId;
	switch (parseInt(typeParam)) {
		case 1:
			stateParam = 'A' + introIdParam;
			break;
		case 2:
			stateParam = 'B' + introIdParam;
			break;
		case 3:
			stateParam = 'C' + introIdParam;
			break;
		case 4:
			stateParam = 'D' + introIdParam;
			break;
		case 5:
			stateParam = 'E' + introIdParam;
			break;
		case 6:
			stateParam = 'F' + introIdParam;
			break;
		case 7:
			stateParam = 'G' + introIdParam;
			break;
		case 8:
			stateParam = 'H' + introIdParam;
			break;
		case 9:
			stateParam = 'I' + introIdParam;
			break;
		default:
			stateParam = 'A' + 0;
	}
	return stateParam;
};
var getUrlParam = function (divide) {
	//获取url上-分隔的参数，如b2-1，传递参数是分隔的字符，返回数组[2,1]

	var locationHref = window.location.pathname;
	var result = locationHref.substr(locationHref.indexOf(divide));
	result = result.split('-');
	var first = result[0].substr(result[0].indexOf(divide) + 1);
	result.shift();
	result.unshift(first);
	return result;
};