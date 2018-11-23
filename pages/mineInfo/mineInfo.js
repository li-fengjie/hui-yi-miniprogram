// pages/mineInfo/mineInfo.js
var util = require("../../utils/util.js")
Page({
	data: {

	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: '会易签到',
			path: '/pages/login/index'
		}
	},
	onLoad: function (options) {
		wx.showNavigationBarLoading() //在标题栏中显示加载
		this._getUserInfor();
		// this.setAnimation();
	},
	onReady: function (options) {
		wx.hideNavigationBarLoading() //完成停止加载
	},
	onPageStart: function (event) {
		var touch = event.touches[0];
		var lastY = touch.pageY;
		this.setData({
			lastY: lastY,
			startY: lastY
		})
	},

	onPageScroll: function (e) {
		var scrTop = e.scrollTop;
		var winHeight = wx.getSystemInfoSync().windowHeight;
		var percentY = Math.round(scrTop * 100) / winHeight;
		var rate = percentY / 19.3;
		var time = 10 / 14;
		var scaleTime = 1 - time;
		var sca = 1 - rate * scaleTime;
		var bl = rate * 0.6;
		this.setData({
			scale: sca,
			blur: bl
		})
	},
	_getUserInfor: function () {
		var userAccount = wx.getStorageSync("userAccount");
		var uid = userAccount.uid;
		console.log(uid);
		var that = this;
		wx.request({
			url: 'https://huiyix.applinzi.com/public/api/User/inforShow?uid=' + uid,
			success: function (res) {
				console.log(res.data.result);
				if(res.data.result.uphoto){
					that.setData({
						uphoto:true
					})
				}else{
					that.setData({
						uphoto:false
					})
				}
				that.setData({
					userInfor: res.data.result
				});
			}
		})
	},
	onJumpSysSetting: function () {
		wx.navigateTo({
			url: './device/device'
		})
	},
	onJumpFeedBack: function () {
		wx.navigateTo({
			url: './feedBack/feedBack'
		});
	},
	onJumpHistoryMeet: function () {
		wx.navigateTo({
			url: './historyMeet/historyMeet'
		})
	},
	onJumpMineInfor: function () {
		wx.navigateTo({
			url: './info-detail/info-detail'
		})
	},
	onJumpTips: function () {
		wx.navigateTo({
			url: './tips/tips'
		})
	},
	onExit: function () {
		wx.redirectTo({
			url: '../login/index',
			success: function () {
				wx.clearStorageSync();
				var isfingerPrint = util.checkIsSupportSoter();
				// console.log(isfingerPrint);
			}
		})
	}
})