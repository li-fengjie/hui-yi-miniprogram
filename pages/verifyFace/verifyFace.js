var util = require("../../utils/util.js");

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	},

	// takePhoto() {
	// 	var that = this;
	// 	this.ctx.takePhoto({
	// 		// quality: 'high',
	// 		quality:'normal',
	// 		success: (res) => {
	// 			this.setData({
	// 				src: res.tempImagePath
	// 			})
	// 			var tempFilePath = res.tempImagePath;
	// 			wx.showLoading({
	// 				title: '验证中...',
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
	// 					if(face != null){
	// 						for (var i = 0; i < face.length; i++) {
	// 							console.log(face[i]['face_id']);
	// 						}
	// 						that.onVerifyFace(face[0]['face_id']);
	// 					}
	// 					else{
	// 						wx.showToast({
	// 							title: '未检测到人脸',
	// 							image:'../../images/error.png',
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
	// 						title: '验证失败',
	// 						image: '../../images/error.png',
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
					src: res.tempImagePath,
					scan:true
				})
				var tempFilePath = res.tempImagePath;
				wx.showLoading({
					title: '验证中...',
				})
				const uploadTask = wx.uploadFile({
					url: 'https://huiyix.applinzi.com/public/api/User/eyeKeyCurl?app_id=80413445322c40f99c80514395221c13&app_key=960511025a55463aad5523beb56b30d7', //仅为示例，非真实的接口地址
					filePath: tempFilePath,
					name: 'File',
					formData: {
						'url': 'http://api.eyekey.com/face/Check/checking',
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
							that.onVerifyFace(face[0]['face_id']);
						}
						else {
							wx.showToast({
								title: '未检测到人脸',
								image: '../../images/error.png',
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
							title: '验证失败',
							image: '../../images/error.png',
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

	// onVerifyFace:function(face_id){
	// 	console.log(face_id);
	// 	var that = this;
	// 	var people_name = this.data.people_name;
	// 	wx.request({
	// 		url: 'http://api.eyekey.com/face/Match/match_verify?app_id=80413445322c40f99c80514395221c13&app_key=960511025a55463aad5523beb56b30d7&face_id='+face_id+'&people_name='+people_name, //仅为示例，并非真实的接口地址
	// 		data: {
	// 			'app_id': '80413445322c40f99c80514395221c13',
	// 			'app_key': '960511025a55463aad5523beb56b30d7',
	// 			'face_id': face_id,
	// 			'people_name': people_name
	// 		},
	// 		header: {
	// 			'content-type': 'application/json' // 默认值
	// 		},
	// 		success: function (res) {
	// 			console.log(res.data)
	// 			wx.hideLoading();
	// 			var result = res.data.result;
	// 			if(result){
	// 				wx.showToast({
	// 					title: '相似度:' + res.data.similarity,
	// 					icon: 'success',
	// 					duration: 2500
	// 				})
	// 				//签到
	// 				var sign_id = that.data.sign_id;
	// 				var signalStrength = that.data.signalStrength;
	// 				console.log(sign_id);
	// 				util.onLogin("",sign_id,signalStrength,true);
	// 			}else{
	// 				wx.showToast({
	// 					title: '验证失败,请重试',
	// 					image: '/image/error.png',
	// 					duration: 1500
	// 				})
	// 			}
	// 		},
	// 		fail: function (res) {
	// 			console.log(res)
	// 		}
	// 	})
	// },

	onVerifyFace: function (face_id) {
		console.log(face_id);
		var that = this;
		var people_name = this.data.people_name;
		wx.request({
			url: 'https://huiyix.applinzi.com/public/api/User/eyeKeyCurl?app_id=80413445322c40f99c80514395221c13&app_key=960511025a55463aad5523beb56b30d7&face_id=' + face_id + '&people_name=' + people_name + '&method=GET', //仅为示例，并非真实的接口地址
			data: {
				'url': 'http://api.eyekey.com/face/Match/match_verify',
				'app_id': '80413445322c40f99c80514395221c13',
				'app_key': '960511025a55463aad5523beb56b30d7',
				'face_id': face_id,
				'people_name': people_name,
				'method': 'GET'
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res.data)
				wx.hideLoading();
				var result = res.data.result;
				if (result) {
					wx.showToast({
						title: '相似度:' + res.data.similarity,
						icon: 'success',
						duration: 2500
					})
					//签到
					var sign_id = that.data.sign_id;
					var signalStrength = that.data.signalStrength;
					console.log(sign_id);
					util.onLogin("", sign_id, signalStrength, true);
				} else {
					wx.showToast({
						title: '验证失败,请重试',
						image: '/image/error.png',
						duration: 1500
					})
				}
			},
			fail: function (res) {
				console.log(res)
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.ctx = wx.createCameraContext();
		var sign_id = options.sign_id;
		var signalStrength = options.signalStrength;
		console.log(sign_id);
		var people_name = util._getPeopleName();
		console.log(people_name);
		this.setData({
			people_name: people_name,
			sign_id: sign_id,
			signalStrength: signalStrength
		})
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