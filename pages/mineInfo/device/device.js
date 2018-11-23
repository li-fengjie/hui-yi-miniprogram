var util = require("../../../utils/util.js");

Page({
	data: {
		phoneInfo: [],
		softInfo: [],
		soter: [],
	},
	onLoad: function () {
		wx.showNavigationBarLoading() //在标题栏中显示加载
		var that = this;
		util.checkIsSupportSoter();
		var soter = wx.getStorageSync("fingerPrint");
		var fingerPrint = "不支持";
		if (soter) {
			fingerPrint = "支持";
		}
		wx.getSystemInfo({
			success: function (res) {
				console.log(res)
				that.setData({
					phoneInfo: [
						{ key: "手机型号", val: res.model },
						{ key: "手机语言", val: res.language }
					],
					softInfo: [
						{ key: "微信版本", val: res.version },
						{ key: "操作系统版本", val: res.system },
					],
					soter: [
						{ key: "指纹签到", val: fingerPrint },
						{ key: "刷脸签到", val: "支持" },
					]
				});
			}
		});
	},
	onReady: function (options) {
		wx.hideNavigationBarLoading() //完成停止加载
	},
});