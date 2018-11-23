// pages/login/index.js
var util = require("../../utils/util.js");
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		'passStatus': 'password',
		'srcUrl': '/image/ciphertext.png',
		login: "color:rgb(6,190,190)",
		register: "color:white",
		isLogin: false,
		isRegister: "/image/defaultAvatar.png",
		fingerPrintTip: "添加指纹"
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
	
	onShow: function (options) {
		var isfingerPrint = util.checkIsSupportSoter();
		// console.log(isfingerPrint);
		this.setData({
			isfingerPrint: isfingerPrint
		})
	},

	onReady: function (options) {
		var isfingerPrint = util.checkIsSupportSoter();
		// console.log(isfingerPrint);
		this.setData({
			isfingerPrint: isfingerPrint
		})
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
	},

	onLoad: function (options) {
		var userData = wx.getStorageSync("userAccount");
		var uid = userData.uid;
		var pwd = userData.pwd;
		if (uid) {
			this.setData({
				uid: uid
			})
			if (pwd) {
				this.setData({
					pwd: pwd
				})
			}
		}
		var isfingerPrint = util.checkIsSupportSoter();
		// console.log(isfingerPrint);
		this.setData({
			isfingerPrint: isfingerPrint
		})
	},

	onSwitchWay: function (event) {
		var way = event.currentTarget.dataset.switchWay;
		console.log()
		if (way === "login") {
			this.setData({
				login: "color:rgb(6,190,190)",
				register: "color:white",
				isLogin: false,
				isRegister: "/image/defaultAvatar.png"
			})
		} else if (way === "register") {
			this.setData({
				login: "color:white",
				register: "color:rgb(6,190,190)",
				isLogin: true,
				isRegister: "/image/add.png"
			})
		}
	},

	_loginAnimation: function () {
		var that = this;
		this.setData({
			loginAni: "animation:loginAni 0.3s linear;"
		});
		setTimeout(function () {
			that.setData({
				logining: "width:100rpx;"
			});
			that.setData({
				loginAni2: "animation:loginAni2 1s linear infinite;"
			});
		}, 300);
	},

	onUserLogin: function (e) {
		var that = this;
		var uid = that.data.uid;
		var pwd = that.data.pwd;
		if (!uid || !pwd) {
			wx.showToast({
				title: '账号不得为空',
				duration: 1500,
				image: "/image/error.png",
				mask: true
			})
			return;
		}
		this._loginAnimation();
		setTimeout(function () {
			wx.request({
				url: 'https://huiyix.applinzi.com/public/api/User/login?uid=' + uid + "&pwd=" + pwd,
				method: "POST",
				header: {
					"content-type": "json"
				},
				success: function (res) {
					if (res.data.code == "20004") {
						wx.setStorageSync("userAccount", { uid: uid, pwd: pwd });
						wx.switchTab({
							url: '/pages/meetList/meetList',
							success: function () {
							},
							fail: function () {
								console.log("login fail")
							}
						})
					} else if (res.data.code == "10009") {
						wx.showToast({
							title: '密码有误',
							duration: 1000,
							image: "/image/error.png",
							mask: true
						})
						that.setData({
							loginAni: "",
							loginAni2: "",
						});
						setTimeout(function () {
							that.setData({
								logining: "animation:loginAni3 0.3s linear"
							});
						}, 100);
					} else if (res.data.code == "10011") {
						wx.showToast({
							title: "输入信息错误",
							duration: 1000,
							image: "/image/error.png",
							mask: true
						});

						setTimeout(function () {
							that.setData({
								logining: "animation:loginAni3 0.3s linear"
							});
						}, 300);
					}
				},
				fail: function (res) {
					wx.showToast({
						title: "请检查您的网络",
						duration: 1500,
						icon: 'none',
						mask: true
					});

					setTimeout(function () {
						that.setData({
							logining: "animation:loginAni3 0.3s linear"
						});
					}, 300);
				}
			})
		}, 2000);

	},

	onFingerPrint: function () {
		var that = this;
		var uid = that.data.uid;
		if (!uid) {
			wx.showToast({
				title: '账号不得为空',
				image: "/image/error.png",
				mask: true
			})
			return;
		}
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
				that.onFingerPrintLogin(fid);
			},
			fail(res) {
				console.log("识别失败", res);
			}
		})
	},

	onFingerPrintLogin: function (fid) {
		var that = this;
		var uid = that.data.uid;
		wx.request({
			url: 'https://huiyix.applinzi.com/public/api/User/login?uid=' + uid + "&pid=" + fid,
			method: "POST",
			header: {
				"content-type": "json"
			},
			success: function (res) {
				console.log(res);
				if (res.data.code == "20004") {
					wx.setStorageSync("userAccount", { uid: uid });
					wx.switchTab({
						url: '/pages/meetList/meetList',
						success: function () {
						},
						fail: function () {
							console.log("login fail")
						}
					})
				} else if (res.data.code == "10009") {
					wx.showToast({
						title: '密码有误',
						duration: 1000,
						image: "/image/error.png",
						mask: true
					})
					that.setData({
						loginAni: "",
						loginAni2: "",
					});
					setTimeout(function () {
						that.setData({
							logining: "animation:loginAni3 0.3s linear"
						});
					}, 100);
				} else {
					wx.showToast({
						title: "指纹验证失败",
						duration: 1000,
						image: "/image/error.png",
						mask: true
					});
				}
			}
		})
	},

	onSwitchClear: function () {
		console.log("明文");
		this.setData({
			passStatus: 'text',
			srcUrl: '/image/clear.png'
		})

	},
	onSwitchciphertext: function () {
		console.log("暗文");
		this.setData({
			passStatus: 'password',
			srcUrl: '/image/ciphertext.png'
		})
	},

	//注册
	onRegister: function () {
		var that = this;
		if (!this.data.registerEnterPrise || !this.data.registerName || !this.data.registerUid || !this.data.registerPhone || !this.data.registerPwd) {
			util.showMsg("提示", "请将信息补充完整", false);
			return false;
		}
		var fingerPrint = wx.getStorageSync("fingerPrint");
		if (!fingerPrint) {
			this.setData({
				fid: ''
			})
		}
		if (!this.data.fid) {
			if (!(this.data.fid == '')){
				util.showMsg("提示", "请录入指纹", false);
				return false;
			}
		}
		var fid = that.data.fid;
		wx.request({
			url: 'https://huiyix.applinzi.com/public/api/User/register',
			data: {
				bname: this.data.registerEnterPrise,
				uname: this.data.registerName,
				uid: this.data.registerUid,
				uphone: this.data.registerPhone,
				pwd: this.data.registerPwd,
				upid: fid
			},
			method: "POST",
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {
				console.log(res);
				var code = res.data.code;
				console.log(code);
				if (code == "20002") {
					wx.setStorageSync("userAccount", { uid: that.data.registerUid, pwd: that.data.registerPwd });
					wx.showToast({
						title: '注册成功',
						icon: 'success'
					})
					wx.setStorageSync("bname", that.data.registerEnterPrise);
					//跳转face页面
					that.onFacial();
				} else if (code == "10004") {
					util.showMsg("提示", "企业不存在", false);
				} else if (code == "10000") {
					util.showMsg("提示", "用户名已存在");
				} else {
					util.showMsg("提示", "注册失败，请重试", false);
				}
			}
		})
	},

	onFingerPrintFid: function () {
		var that = this;
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
				that.setData({
					fid: fid,
					fingerPrintTip: "添加成功"
				})
			},
			fail(res) {
				console.log("识别失败", res);
			}
		})
	},

	onFacial: function () {
		wx.getSetting({
			success: function (res) {
				console.log(res);
				if (!res.authSetting['scope.camera']) {
					wx.authorize({
						scope: 'scope.camera',
						success() {
							wx.navigateTo({
								url: '../registeredFace/registeredFace',
							})
						},
						fail() {
							wx.showModal({
								title: '提示',
								content: '需要开启相机权限',
								success: function (res) {
									if (res.confirm) {
										//跳转去设置
										wx.openSetting({
											success: function (res) {
												console.log(res);
											}
										})
									}
								}
							})
						}
					})
				} else {
					wx.navigateTo({
						url: '../registeredFace/registeredFace?addFace=' + false,
					})
				}
			}
		})
	},

	saveUid: function (e) {
		this.setData({
			"uid": e.detail.value
		})
	},
	savePwd: function (e) {
		this.setData({
			"pwd": e.detail.value
		})
	},

	saveRegisterUid: function (e) {
		var uid = e.detail.value;
		// if (uid.length < 8) {
		//   this.showMsg("提示", "账号不能小于八位", false);
		//   return false;
		// }
		// var regex = /^[0-9A-Za-z_]$/;
		// if (!regex.exec(uid)) {
		//   this.showMsg("提示", "账号只能是下划线、数字、字母", false);
		//   return false;
		// }
		this.setData({
			registerUid: uid
		});
	},
	saveRegisterPwd: function (e) {
		var pwd = e.detail.value;
		// if (pwd.length < 8) {
		//   this.showMsg("提示", "密码太短,密码不能小于八位", false);
		//   return false;
		// }
		// var regex = /^[0-9A-Za-z]$/;
		// if (!regex.exec(uid)) {
		//   this.showMsg("提示", "密码只能是数字、字母", false);
		//   return false;
		// }
		this.setData({
			registerPwd: pwd
		})
	},
	saveRegisterPwd1: function (e) {
		var pwd = e.detail.value;
		if (this.data.registerPwd && this.data.registerPwd !== pwd) {
			util.showMsg("提示", "密码不一致", false);
			return false;
		}
	},
	saveRegisterEnterPrise: function (e) {
		var enterPrise = e.detail.value;
		// var regex = /^[a-zA-Z\u4e00-\u9fa5]+$/;
		// if (!regex.exec(enterPrise)) {
		//   this.showMsg("提示", "企业名只能输入汉字和字母");
		//   return false;
		// }
		this.setData({
			registerEnterPrise: enterPrise
		});
	},
	saveRegisterName: function (e) {
		var name = e.detail.value;
		// var regex = /^[a-zA-Z\u4e00-\u9fa5]+$/;
		// if (!regex.exec(enterPrise)) {
		//   this.showMsg("提示", "姓名只能输入汉字和字母");
		//   return false;
		// }
		this.setData({
			registerName: name
		});
	},
	saveRegisterPhone: function (e) {
		var phone = e.detail.value;
		// var regex = /^1[3|4|5|8][0-9]\d{4,8}$/;
		// if (!regex.exec(phone)) {
		//   this.showMsg("提示", "请输入正确的手机号码", false)
		//   return false;
		// }
		this.setData({
			registerPhone: phone
		})
	},
})