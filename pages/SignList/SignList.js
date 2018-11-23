// pages/SignList/SignList.js
var util = require("../../utils/util.js");

Page({
	data: {
		serachFlag: true,
		isHaveMeet: true,
		isOpenWifi: false,
		needOpenGPS: true
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
		wx.showNavigationBarLoading() //在标题栏中显示加载
		var isfingerPrint = util.checkIsSupportSoter();
		this._getSignListData();
		this.setAniation();
		try {
			var value = wx.getStorageSync('bname');
			console.log(value);
			if (value == '') {
				var bname = util._getUserBname();
				console.log(bname);
			}
		} catch (e) {
			util._getUserBname();
			console.log(bname);
		}
	},
	onReady: function (options) {
		wx.hideNavigationBarLoading() //完成停止加载
	},
	onShow: function (options) {
		this._getSignListData();
		wx.removeTabBarBadge({
			index: 1,
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
					that.setData({
						isHaveMeet: false
					});
					return;
				}
				if (data === 'undefined') {

				} else {
					for (var i in data) {
						data[i].tagUrl = data[i].issign ? "/image/ok.png" : "/image/no.png"
						data[i].mlstartime = data[i].mlstartime.substring(5);
						data[i].mlendtime = data[i].mlendtime.substring(5);
						// data[i].equImg = data[i].bluetoothmac ? "/image/bluetooth.png" : "/image/wifi.png"
						// console.log(data[i].issign);
						if (data[i].bluetoothmac) {
							data.splice(i, 1);
						}
					}
					for (var i in data) {
						data[i].tagUrl = data[i].issign ? "/image/ok.png" : "/image/no.png"
						data[i].mlstartime = data[i].mlstartime.substring(5);
						data[i].mlendtime = data[i].mlendtime.substring(5);
					}
					that.setData({
						signList: data
					})
					// if (res.data.result.length > 0) {
					// 	wx.removeTabBarBadge({
					// 		index: 1,
					// 	})
					// }
				}
			}
		})
	},
	setAniation: function () {
		var animation = wx.createAnimation({
			timingFunction: 'ease-in'
		});
		this.animation = animation;
	},
	onHideSeachEqu: function (event) {
		this.data.ani = "";
		this.setData({
			ani: "animation:aniDown 0.3s ease-out"
		});
		setTimeout(function () {
			this.setData({ serachFlag: true })
		}.bind(this), 300)
	},

	onSerachEqu: function (event) {
		var issign = event.currentTarget.dataset.isSign;
		console.log(issign);
		if (issign == 1) {
			wx.showToast({
				title: '已签到',
				icon: 'success'
			})
			return;
		}
		console.log("serach");
		this.setData({
			ani: "animation: aniUp 0.3s ease-out",
			serachFlag: false
		});
		var signId = event.currentTarget.dataset.signId;
		var wlanMac = event.currentTarget.dataset.wlanMac;
		var bluetoothMac = event.currentTarget.dataset.bluetoothMac;
		if (bluetoothMac) {
			// this._callBlueToothApi(signId, wlanMac);
		} else if (wlanMac) {
			this._callWlanApi(signId, wlanMac);
		}
	},

	_callWlanApi: function (signId, mac) {
		console.log(signId + mac);
		this.onGetWifiList(signId, mac);
	},

	isOpenWifi: function () {
		var that = this;
		wx.getNetworkType({
			success: function (res) {
				var networkType = res.networkType
				if (!(networkType == "wifi")) {
					var isOpenWifi = that.data.isOpenWifi;
					if (!isOpenWifi) {
						that.showModal("开启 wifi ?", "请开启wifi后，再搜索管理员设备", "已打开");
						that.onHideSeachEqu();
						return;
					}
				}
				var needOpenGPS = that.data.needOpenGPS;
				console.log(needOpenGPS);
				if (needOpenGPS) {
					// that.showModal("开启 GPS ?", "请开启GPS定位开关后，再搜索管理员设备", "已打开");
					wx.showToast({
						title: '请开启GPS定位开关后，再搜索管理员设备',
						icon: 'none'
					})
					return;
				} else {
					wx.showToast({
						title: '请开启GPS定位开关后，再搜索管理员设备',
						icon: 'none'
					})
				}
			},
			fail: function (res) {
				console.log("获取网络状态失败");
			}
		})
	},

	searchAimMac: function (res, signId, wlanMac) {
		var that = this;
		if (res.wifiList.length > 0) {
			this.setData({
				needOpenGPS: false
			})
			for (var i = 0; i < res.wifiList.length; i++) {
				console.log(res.wifiList[i]['SSID'] + " " + res.wifiList[i]['BSSID']);
				console.log(wlanMac == res.wifiList[i]['BSSID']);
				if (wlanMac == res.wifiList[i]['BSSID']) {
					setTimeout(function () {
						that.onHideSeachEqu();
					}, 4000)
					var signalStrength = res.wifiList[i]['signalStrength'];
					var isSupportSoter = util.checkIsSupportSoter();
					console.log(isSupportSoter);
					if (isSupportSoter) {
						//指纹签到
						wx.startSoterAuthentication({
							requestAuthModes: ["fingerPrint"],
							challenge: '123456',
							authContent: "请将手指放到指纹传感器上",
							success(res) {
								console.log("识别成功", res);
								var result = res.resultJSON;
								console.log(result);
								var resultJSON = JSON.parse(result);
								var fid = resultJSON.fid;
								console.log(fid);
								console.log(resultJSON.cpu_id);
								util.onLogin(fid, signId, signalStrength, false);
								this._getSignListData();
								return;
							},
							fail(res) {
								console.log("识别失败", res);
								console.log(res.errCode);
								if (res.errCode == '90001') {
									//刷脸签到
									var people_name = util._getPeopleName();
									console.log(people_name);
									that.onPeopleGet(people_name, signId, signalStrength);
									return;
								}
							}
						})
					} else {
						//刷脸签到
						var people_name = util._getPeopleName();
						console.log(people_name);
						that.onPeopleGet(people_name, signId, signalStrength);
					}
					return;
				}
			}
			setTimeout(function () {
				var serachFlag = that.data.serachFlag;
				if (!serachFlag) {
					that.onHideSeachEqu();
					wx.showToast({
						title: '您可能不在会场范围内,请靠近会场后重试',
						icon: 'none',
						duration: 3000
					})
				}
			}, 15000);
			// wx.showLoading({
			// 	title: '搜索中...',
			// })
			// setTimeout(function () {
			// 	wx.hideLoading()
			// }, 3000)
		} else {
			this.onHideSeachEqu();
			this.setData({
				needOpenGPS: true
			})
		}
	},

	onPeopleGet: function (people_name, sign_id, signalStrength) {
		var that = this;
		wx.request({
			url: 'https://huiyix.applinzi.com/public/api/User/eyeKeyCurl?app_id=80413445322c40f99c80514395221c13&app_key=960511025a55463aad5523beb56b30d7&people_name=' + people_name + '&method=GET',
			data: {
				'url': 'http://api.eyekey.com/People/people_get',
				'app_id': '80413445322c40f99c80514395221c13',
				'app_key': '960511025a55463aad5523beb56b30d7',
				'people_name': people_name,
				'method': 'GET'
			},

			success: function (res) {
				var code = res.data.res_code;
				if (code == "0000") {
					wx.navigateTo({
						url: '/pages/verifyFace/verifyFace?sign_id=' + sign_id + '&signalStrength=' + signalStrength,
					});
				} else {
					that.onHideSeachEqu();
					wx.showToast({
						title: '人脸尚未录入',
						image: '/image/error.png'
					})
				}
			}
		})
	},

	onGetWifiList: function (signId, mac) {
		var that = this;
		that.isOpenWifi();
		wx.startWifi({
			success: function (res) {
				console.log(res.errMsg);
				wx.getWifiList({
					success: function (res) {
						console.log(res);
					}
				});
				wx.onGetWifiList(function (res) {
					console.log(res.wifiList);
					console.log(mac);
					setTimeout(function () {
						that.searchAimMac(res, signId, mac);
					}, 30000);
				})
				// wx.getWifiList()
			},
			fail: function (res) {
				console.log(res)
			}
		})
	},

	getSystemVersion: function () {
		try {
			var res = wx.getSystemInfoSync()
			console.log(res.system);
			var platform = res.platform;
			var system = res.system.split(" ")[1];
			console.log(system);
			var version = system.split(".")[0];
			console.log(version)
			if (version >= 6 && platform == "android") {
				this.setData({
					needOpenGPS: true
				})
			} else {
				this.setData({
					needOpenGPS: false
				})
			}
		} catch (e) {
			console.log(e);
		}
	},

	//显示模态窗口
	showModal: function (title, content, confirmText, callback) {
		wx.showModal({
			title: title,
			content: content,
			confirmColor: '#1F4BA5',
			cancelColor: '#7F8389',
			confirmText: confirmText,
			success: function (res) {
				if (res.confirm) {
					callback && callback();
				} else {
					console.log("取消")
				}
			}
		})
	},

	onPullDownRefresh: function () {
		wx.showNavigationBarLoading() //在标题栏中显示加载
		this._getSignListData();
		//模拟加载
		setTimeout(function () {
			// complete
			wx.hideNavigationBarLoading() //完成停止加载
			wx.stopPullDownRefresh() //停止下拉刷新
		}, 1500);
	},

	// _callBlueToothApi: function (signId, mac) {
	// 	var that = this;
	// 	wx.startBluetoothDevicesDiscovery({
	// 		success: function (res) {

	// 		},
	// 		fail: function () {

	// 		}
	// 	})
	// },
})