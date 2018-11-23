// pages/mineInfo/historyMeet/historyMeet.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isHaveMeet: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showNavigationBarLoading() //在标题栏中显示加载
		this._getHistoryMeet();
	},
	onReady: function (options) {
		wx.hideNavigationBarLoading() //完成停止加载
	},
	_getHistoryMeet: function () {
		var userAccount = wx.getStorageSync("userAccount");
		var uid = userAccount.uid;
		var that = this;
		wx.request({
			url: 'https://huiyix.applinzi.com/public/api/Meet/historyMeet?uid=' + uid,
			success: function (res) {
				var historyMeet = res.data.result;
				if (!historyMeet || historyMeet.length == 0) {
					that.setData({
						isHaveMeet: false
					})
				}
				console.log(historyMeet);
				that.setData({
					historyMeet: historyMeet
				});
			}
		})
	},
	onJumpMeetDetail: function (event) {
		var mid = event.currentTarget.dataset.meetId;
		wx.setStorageSync("mid", mid)
		wx.navigateTo({
			url: '../../meetList/meet-detail/meet-detail?mid=' + mid,
			success: function () {
			}
		})
	}
})