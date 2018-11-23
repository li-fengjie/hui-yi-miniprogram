// pages/meetList/meetList.js
var util = require('../../utils/util.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isHaveMeet: true,
		isHideLoadMore: true,
		pageNo: 0,
		meetList: [],
		haveData: true,
		loadingTip: "正在加载"
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
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var isfingerPrint = util.checkIsSupportSoter();
		if (!isfingerPrint) {
			wx.setTabBarItem({
				index: 1,
				iconPath: '/image/face.png',
				selectedIconPath: '/image/faceSelected.png',
				success: function (res) {
					console.log(res);
				},
				fail: function (res) {
					console.log(res);
				}
			})
		}
		this._getMeetData(0);
		wx.showNavigationBarLoading() //在标题栏中显示加载
	},
	onReady: function (options) {
		wx.hideNavigationBarLoading() //完成停止加载
		this._getSignListData();
	},
	_getMeetData: function (pageNo) {
		var userAccount = wx.getStorageSync("userAccount");
		var uid = userAccount.uid;
		// console.log(uid);
		// uid = 1520160003;
		var that = this;
		wx.request({
			url: "https://huiyix.applinzi.com/public/api/Meet/uMeetList?uid=" + uid + "&pageNo=" + pageNo,
			data: {
				pageNo: pageNo
			},
			success: function (res) {
				var meetListResult = res.data.result;
				console.log(res);
				if ((meetListResult === 'undefined' || !meetListResult) && pageNo == 0) {
					that.setData({
						isHaveMeet: false,
						haveData: false,
						meetList: []
					})

				} else if ((meetListResult === 'undefined' || !meetListResult) && pageNo != 0) {
					that.setData({
						haveData: false,
						loadingTip: "到底了 ('◡')"
					})
					that.setData({
						isHideLoadMore: true,
					})
				} else {
					if (pageNo != 0) {
						var meetList = that.data.meetList;
						for (var i = 0; i < meetListResult.length; i++) {
							meetList.push(meetListResult[i]);
						}
						that.setData({
							meetList: meetList
						});
					} else {
						that.setData({
							meetList: meetListResult
						});
					}
				}
				// console.log(that.data.isHaveMeet)
			}
		});
	},
	onJumpMeetDetail: function (event) {
		var mid = event.currentTarget.dataset.meetId;
		wx.setStorageSync("mid", mid)
		wx.navigateTo({
			url: './meet-detail/meet-detail?mid=' + mid,
			success: function () {
			}
		})
	},

	_getSignListData: function () {
		var userAccount = wx.getStorageSync("userAccount");
		var uid = userAccount.uid;
		console.log(uid);
		var that = this;
		wx.request({
			url: 'https://huiyix.applinzi.com/public/api/Meet/meetsignList?uid=' + uid,
			success: function (res) {
				console.log(res);
				var data = res.data.result;
				var code = res.data.code;
				if ((code != '20006' && code != '20013') || data.length == 0) {
					return;
				}
				if (data === 'undefined') {
				} else {
					var num = res.data.result.length;
					for (var i in data) {
						if (data[i].bluetoothmac) {
							num--;
						}
					}
					var badge = new String(num);
					if (res.data.result.length > 0) {
						// wx.removeTabBarBadge({
						// 	index: 1,
						// })
						wx.setTabBarBadge({
							index: 1,
							text: badge
						})
					}
				}
			}
		})
	},

	onPullDownRefresh: function () {
		wx.showNavigationBarLoading() //在标题栏中显示加载
		var meetList = this.data.meetList;
		this.setData({
			pageNo: 0,
			haveData: true,
			loadingTip: "正在加载",
			isHaveMeet: true
		})
		this._getMeetData(0);
		//模拟加载
		setTimeout(function () {
			// complete
			wx.hideNavigationBarLoading() //完成停止加载
			wx.stopPullDownRefresh() //停止下拉刷新
		}, 1500);
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		var that = this;
		var haveData = that.data.haveData;
		console.log('加载更多')
		setTimeout(() => {
			if (haveData) {
				// var isHaveMeet =that.data.isHaveMeet;
				// console.log(isHaveMeet);
				var pageNo = that.data.pageNo;
				var pageNo = pageNo + 1;
				that.setData({
					pageNo: pageNo
				})
				that._getMeetData(pageNo);
				this.setData({
					isHideLoadMore: false,
				})
			} else {
				this.setData({
					isHideLoadMore: true,
				})
			}
		}, 1000)
	},
})