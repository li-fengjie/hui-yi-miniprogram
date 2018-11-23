// pages/meetList/meet-detail/meet-detail.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var mid = options.mid;
		this.setData({
			mid: mid
		});
		this._getMeetDetailData();
	},
	_getMeetDetailData: function () {
		var mid = wx.getStorageInfoSync("mid") ? wx.getStorageSync("mid") : this.data.mid;
		this.setData({
			mid: mid
		})
		var that = this;
		wx.request({
			//+"&equipment=wexin"
			url: 'https://huiyix.applinzi.com/public/api/Meet/meetContent?mid=' + mid,
			success: function (res) {
				console.log(res);
				var result = res.data.result;
				console.log(result);
				that.setData({
					meetDetail: result
				});
			}
		})
	},
	onJumpComment: function () {
		wx.navigateTo({
			url: './meet-comment/',
		})
	}
})