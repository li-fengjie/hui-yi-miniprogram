function _getUserBname() {
	var userAccount = wx.getStorageSync("userAccount");
	var uid = userAccount.uid;
	console.log(uid);
	wx.request({
		url: 'https://huiyix.applinzi.com/public/api/User/inforShow?uid=' + uid,
		success: function (res) {
			console.log(res.data.result);
			wx.setStorageSync('bname', res.data.result.bname);
			wx.setStorage({
				key: 'bname',
				data: res.data.result.bname,
			})
			return res.data.result.bname;
		}
	})
}

function checkIsSupportSoter() {
	var that = this;
	var fingerPrint = wx.getStorageSync("fingerPrint");
	// console.log(fingerPrint);
	if (fingerPrint === '' || fingerPrint === 'undefined') {
		console.log("check");
		wx.checkIsSupportSoterAuthentication({
			success: function (res) {
				for (var i in res.supportMode) {
					if (res.supportMode[i] == 'fingerPrint') {
						wx.setStorageSync("fingerPrint", true);
						console.log("支持指纹识别", res.supportMode[i]);
					} else {
						console.log("不支持指纹识别");
						wx.setStorageSync("fingerPrint", false);
					}
				}
			},
			fail: function (res) {
				console.log("当前设备不支持指纹");
				console.log(res);
				wx.setStorageSync("fingerPrint", false);
			}
		})
	}
	var fingerPrint = wx.getStorageSync("fingerPrint");
	return fingerPrint;
}

function showMsg(title, msg, isCancelButton, succ, fail) {
	wx.showModal({
		title: title,
		content: msg,
		showCancel: isCancelButton,
		success: function (res) {
			if (res.confirm) {
				if (succ) {
					succ();
				}
			} else if (res.cancel) {
				if (fail) {
					fail();
				}
			}
		}
	})
}

function onLogin(fid, signId, signalStrength, back) {
	var userInfo = wx.getStorageSync("userAccount");
	var uid = userInfo.uid;
	wx.request({
		url: 'https://huiyix.applinzi.com/public/api/Meet/uMeetSign',
		data: {
			sign_id: signId,
			uid: uid,
			pid: fid,
			rssi: signalStrength
		},
		success: function (res) {
			console.log(res);
			var code = res.data.code;
			if (code == '20031') {
				wx.showToast({
					title: '签到成功',
					icon: 'success',
					duration: 2000,
					mask: true
				})
				if (back) {
					setTimeout(function(){
						wx.navigateBack({
							delta: 1
						});
					}
					,3000);
				}
			} else {
				wx.showToast({
					title: '签到失败',
					image: "/image/error.png",
					duration: 2000,
					mask: true
				})
			}
		},
		fail: function (res) {
			console.log(res);
		}
	})
}
function _getPeopleName() {
	var bname;
	try {
		var value = wx.getStorageSync('bname');
		console.log(value);
		if (value == '' || !value) {
			bname = this._getUserBname();
			console.log(bname);
		} else {
			bname = value;
		}
	} catch (e) {
		bname = this._getUserBname();
		console.log(bname);
	}
	var userInfo = wx.getStorageSync("userAccount");
	var uid = userInfo.uid;
	var people_name = bname + "_" + uid;
	console.log(people_name);
	return people_name;
}

module.exports = {
	_getUserBname: _getUserBname,
	checkIsSupportSoter: checkIsSupportSoter,
	showMsg: showMsg,
	onLogin: onLogin,
	_getPeopleName: _getPeopleName
}
