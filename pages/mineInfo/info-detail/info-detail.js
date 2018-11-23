var util = require("../../../utils/util.js");

Page({
	data: {
		userInfo: [],
		bnameInfo: [],
		faceInfo: [],
	},
	onLoad: function () {
		wx.showNavigationBarLoading() //在标题栏中显示加载
		this._getUserInfor();
		util._getUserBname();
	},
	onReady: function (options) {
		wx.hideNavigationBarLoading() //完成停止加载
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
				wx.setStorageSync("bname", res.data.result.bname);
				that.setData({
					userInfo: [
						{ key: "账号", val: uid },
						{ key: "姓名", val: res.data.result.uname }
					],
					bnameInfo: [
						{ key: "企业名称", val: res.data.result.bname },
					],
				});
			}
		})
		var that = this;
		util.checkIsSupportSoter();
		var soter = wx.getStorageSync("fingerPrint");
		var bname = wx.getStorageSync("bname");
		var userAccount = wx.getStorageSync("userAccount");
		var uid = userAccount.uid;
		var people_name = bname + "_" + uid;
		console.log(people_name);
		that.onPeopleGet(soter, people_name);
	},

	// onPeopleGet: function (fingerPrint, people_name) {
	// 	var that = this;
	// 	var fingerPrintTip = "不支持"
	// 	if(fingerPrint){
	// 		fingerPrintTip = "已录入";
	// 	}
	// 	wx.request({
	// 		url: 'http://api.eyekey.com/People/people_get?app_id=80413445322c40f99c80514395221c13&app_key=960511025a55463aad5523beb56b30d7&people_name=' + people_name,
	// 		success: function (res) {
	// 			var code = res.data.res_code;
	// 			if (code == "0000") {
	// 				that.setData({
	// 					faceInfo: [
	// 						{ key: "指纹信息", val: fingerPrintTip },
	// 						{ key: "人脸信息", val: "已录入" },
	// 					],
	// 					face:true
	// 				});
	// 			} else {
	// 				that.setData({
	// 					faceInfo: [
	// 						{ key: "指纹信息", val: fingerPrintTip },
	// 						{ key: "人脸信息", val: "点击录入" },
	// 					],
	// 					face: false
	// 				});
	// 			}
	// 		}
	// 	})
	// },

	onPeopleGet: function (fingerPrint, people_name) {
		var that = this;
		var fingerPrintTip = "不支持"
		if (fingerPrint) {
			fingerPrintTip = "已录入";
		}
		console.log(people_name);
		wx.request({
			url: 'https://huiyix.applinzi.com/public/api/User/eyeKeyCurl?app_id=80413445322c40f99c80514395221c13&app_key=960511025a55463aad5523beb56b30d7&people_name=' + people_name + '&method=GET',
			data:{
				'url':'http://api.eyekey.com/People/people_get',
				'app_id': '80413445322c40f99c80514395221c13',
				'app_key': '960511025a55463aad5523beb56b30d7',
				'people_name':people_name,
				'method': 'GET'
			},
			success: function (res) {
				console.log(res);
				var code = res.data.res_code;
				if (code == "0000") {
					that.setData({
						faceInfo: [
							{ key: "指纹信息", val: fingerPrintTip },
							{ key: "人脸信息", val: "已录入" },
						],
						face: true
					});
				} else {
					that.setData({
						faceInfo: [
							{ key: "指纹信息", val: fingerPrintTip },
							{ key: "人脸信息", val: "点击录入" },
						],
						face: false
					});
				}
			}
		})
	},

	onAddFaceTap:function(){
		var face = this.data.face;
		console.log(face);
		if(face){
			return;
		}
		wx.navigateTo({
			url: '/pages/registeredFace/registeredFace?addFace=' + true,
		})
	},

	onShow: function (options) {
		// 生命周期函数--监听小程序显示(后退到这个页面的时候这个就会被回调)    当小程序启动，或从后台进入前台显示，会触发 onShow 
		this._getUserInfor();   
	},
});