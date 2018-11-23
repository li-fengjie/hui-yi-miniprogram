// pages/registeredFace/registeredFace.js
var util = require("../../utils/util.js")

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		addFace: false
	},

	// takePhoto() {
	// 	var that = this;
	// 	this.ctx.takePhoto({
	// 		// quality: 'high',
	// 		quality: 'normal',
	// 		success: (res) => {
	// 			this.setData({
	// 				src: res.tempImagePath
	// 			})
	// 			var tempFilePath = res.tempImagePath;
	// 			wx.showLoading({
	// 				title: '注册中...',
	// 			})
	// 			const uploadTask = wx.uploadFile({
	// 				url: 'http://api.eyekey.com/face/Check/checking?app_id=80413445322c40f99c80514395221c13&app_key=960511025a55463aad5523beb56b30d7', //仅为示例，非真实的接口地址
	// 				filePath: tempFilePath,
	// 				name: 'File',
	// 				formData: {
	// 					'app_id': '80413445322c40f99c80514395221c13',
	// 					'app_key': '960511025a55463aad5523beb56b30d7'
	// 				},
	// 				success: function (res) {
	// 					console.log(res);
	// 					var faces = res.data;
	// 					var resultJSON = JSON.parse(faces);
	// 					var face = resultJSON.face;
	// 					if (face != null) {
	// 						for (var i = 0; i < face.length; i++) {
	// 							console.log(face[i]['face_id']);
	// 						}
	// 						that.onCreatePeople(face[0]['face_id']);
	// 						//facegatherAddFaceid();
	// 						that.onPictureToBase64(tempFilePath);
	// 					}
	// 					else {
	// 						wx.hideLoading();
	// 						wx.showToast({
	// 							title: '未检测到人脸',
	// 							image: '/image/error.png',
	// 							duration: 1500
	// 						})
	// 					}
	// 					// for(var i = 0; i < res.data.face.length; i++){
	// 					// 	console.log(res.data.face[i]['face_id']);
	// 					// }
	// 				}, fail: function (res) {
	// 					console.log(res);
	// 					wx.hideLoading();
	// 					wx.showToast({
	// 						title: '注册失败',
	// 						image: '../../image/x.png',
	// 						duration: 1500
	// 					})
	// 				}
	// 			})

	// 			uploadTask.onProgressUpdate((res) => {
	// 				console.log('上传进度', res.progress)
	// 				console.log('已经上传的数据长度', res.totalBytesSent)
	// 				console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
	// 			})
	// 		}
	// 	})
	// },

	takePhoto() {
		var that = this;
		this.ctx.takePhoto({
			// quality: 'high',
			quality: 'normal',
			success: (res) => {
				this.setData({
					src: res.tempImagePath
				})
				var tempFilePath = res.tempImagePath;
				wx.showLoading({
					title: '注册中...',
				})
				const uploadTask = wx.uploadFile({
					url: 'https://huiyix.applinzi.com/public/api/User/eyeKeyCurl?app_id=80413445322c40f99c80514395221c13&app_key=960511025a55463aad5523beb56b30d7', //仅为示例，非真实的接口地址
					filePath: tempFilePath,
					name: 'File',
					formData: {
						'url':'http://api.eyekey.com/face/Check/checking',
						'app_id': '80413445322c40f99c80514395221c13',
						'app_key': '960511025a55463aad5523beb56b30d7'
					},
					success: function (res) {
						console.log(res);
						var faces = res.data;
						var resultJSON = JSON.parse(faces);
						var face = resultJSON.face;
						if (face != null) {
							for (var i = 0; i < face.length; i++) {
								console.log(face[i]['face_id']);
							}
							that.onCreatePeople(face[0]['face_id']);
							//facegatherAddFaceid();
							// that.onPictureToBase64(tempFilePath);
						}
						else {
							wx.hideLoading();
							wx.showToast({
								title: '未检测到人脸',
								image: '/image/error.png',
								duration: 1500
							})
						}
						// for(var i = 0; i < res.data.face.length; i++){
						// 	console.log(res.data.face[i]['face_id']);
						// }
					}, fail: function (res) {
						console.log(res);
						wx.hideLoading();
						wx.showToast({
							title: '注册失败',
							image: '../../image/x.png',
							duration: 1500
						})
					}
				})

				uploadTask.onProgressUpdate((res) => {
					console.log('上传进度', res.progress)
					console.log('已经上传的数据长度', res.totalBytesSent)
					console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
				})
			}
		})
	},

	onPictureToBase64(path) {
		var that = this;
		wx.uploadFile({
			url: 'https://huiyix.applinzi.com/public/api/User/pictureToBase64',
			filePath: path,
			name: 'uphoto',
			success: function (res) {
				console.log(res);
				var base = JSON.parse(res.data);
				var base64 = base.base64;
				var array = wx.base64ToArrayBuffer(base64);
				var base64 = wx.arrayBufferToBase64(array);
				console.log(base64);
				var base64 = base64.replace(/\//g,'_');
				var bass64 = base64.replace(/\=/g, "");
				var base64 = base64.replace(/\+/g,'-');
				// console.log(base64);
				// var base64 = base64.split('+').join('-');
				// var base64 = base64.split('/').join('_');
				// var base64 = base64.split('=').join('');
				// console.log(base64);
				// that.onUploadPhoto(base64);
			}, fail: function (res) {
				console.log(res)
			}
		})
	},

	onUploadPhoto(base64) {
		var that = this;
		var userInfor = wx.getStorageSync("userAccount");
		var uid = userInfor.uid;
		var pwd = userInfor.pwd;
		wx.request({
			url: 'https://huiyix.applinzi.com/public/api/User/uploadPicture?uid=' + uid,
			data: {
				uid: uid,
				uphoto: base64
			},
			header:{
				'content- type':'application/x-www-form-urlencoded'
			},
			method: "POST",
			success: function (res) {
				console.log(res);
				var code = res.data.code;
				//图片不正常
				if (code == "30000") {
					wx.hideLoading();
					wx.showToast({
						title: '上传成功',
						icon: 'success',
						duration: 1500
					})
				} else {
					console.log("头像上传")
				}
				wx.hideLoading();
				var addFace = that.data.addFace;
				console.log(addFace);
				if (!addFace) {
					that.onLogin(uid, pwd);
				} else {
					setTimeout(function () {
						wx.navigateBack({
							delta: 1
						});
					}, 2000);
				}
			},
			fail: function (res) {
				console.log(res);
			}
		})
	},

	onCreatePeople: function (face_id) {
		var people_name, uid, bname, pwd;
		var that = this;
		wx.getStorage({
			key: 'userAccount',
			success: function (res) {
				uid = res.data.uid;
				pwd = res.data.pwd;
			},
		})
		try {
			var bname = wx.getStorageSync('bname')
			if (bname == '' || bname === 'undefined') {
				bname = util._getUserBname();
			}
		} catch (e) {
			bname = util._getUserBname();
		}
		people_name = bname + "_" + uid;
		console.log(people_name);
		wx.request({
			url: 'https://huiyix.applinzi.com/public/api/User/eyeKeyCurl?app_id=80413445322c40f99c80514395221c13&app_key=960511025a55463aad5523beb56b30d7&people_name=' + people_name + '&face_id=' + face_id + '&method=GET',
			data: {
				'url':'http://api.eyekey.com/People/people_create',
				'app_id': '80413445322c40f99c80514395221c13',
				'app_key': '960511025a55463aad5523beb56b30d7',
				'people_name': people_name,
				'face_id': face_id,
				'method': 'GET'
			},
			success: function (res) {
				console.log(res);
				var code = res.data.res_code;
				if (code == "0000") {//成功
					// wx.hideLoading();
					wx.showToast({
						title: '录入成功',
						icon: 'success',
						duration: 1500
					})
					// wx.showLoading({
					// 	title: '注册中...',
					// })
					//跳转
					// that.onLogin(uid,pwd);
				} else {
					wx.hideLoading();
					wx.showToast({
						title: '注册失败,请重试...',
						image: '../../image/x.png',
						duration: 1500
					})
				}
			}
		})
	},

	onOverTap: function () {
		//跳过按钮
		var userInfor = wx.getStorageSync("userAccount");
		var uid = userInfor.uid;
		var pwd = userInfor.pwd;
		this.onLogin(uid, pwd);
	},

	onLogin: function (uid, pwd) {
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
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.ctx = wx.createCameraContext();
		var addFace = (options.addFace == true);
		console.log(addFace);
		if (addFace) {
			this.setData({
				addFace: true
			})
		} else {
			this.setData({
				addFace: false
			})
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})