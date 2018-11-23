//app.js
var util = require("/utils/util.js");
App({
	onLaunch: function () {
		const updateManager = wx.getUpdateManager()

		updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			console.log(res.hasUpdate)
		})

		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success: function (res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})

		})

		updateManager.onUpdateFailed(function () {
			// 新的版本下载失败
		})
		var userData = wx.getStorageSync("userAccount");
		if (!userData.uid && !userData.pwd) {
			// wx.clearStorageSync();
			util.checkIsSupportSoter();
		} else {
			var uid = userData.uid;
			var pwd = userData.pwd;
			wx.request({
				url: 'https://huiyix.applinzi.com/public/api/User/login?uid=' + uid + "&pwd=" + pwd,
				method: "POST",
				header: {
					"content-type": "json"
				},
				success: function (res) {
					if (res.data.code == "20004") {
						wx.switchTab({
							url: '/pages/meetList/meetList',
							success: function () {
							},
							fail: function () {
								console.log("switchTab fail")
							}
						})
					} else if (res.data.code == "10009") {
						wx.showToast({
							title: '密码有误',
							duration: 1000,
							image: "/image/error.png",
							mask: true
						})
					} else if (res.data.code == "10011") {
						wx.showToast({
							title: "输入错误信息",
							duration: 1000,
							image: "/image/x.png",
							mask: true
						});
					}
				}
			});
		}
	}
})