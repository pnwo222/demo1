## C端获取用户信息

**接口地址**:`/fangyuan/auth/c/getLoginUser`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

**请求参数**:

暂无

**响应状态**:

| 状态码 | 说明 | schema |
| -------- | -------- | ----- |
|200|OK|CommonResultSaBaseClientLoginUser|

**响应参数**:

| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- |
|code|状态码|integer(int32)|integer(int32)|
|msg|提示语|string||
|data||SaBaseClientLoginUser|SaBaseClientLoginUser|
|&emsp;&emsp;id|id|string||
|&emsp;&emsp;avatar|头像，图片base64|string||
|&emsp;&emsp;signature|签名，图片base64|string||
|&emsp;&emsp;openId|一卡通的openId|string||
|&emsp;&emsp;platformId|五竹数据中台的id|string||
|&emsp;&emsp;account|账号|string||
|&emsp;&emsp;name|姓名|string||
|&emsp;&emsp;nickname|昵称|string||
|&emsp;&emsp;gender|性别|string||
|&emsp;&emsp;age|年龄|string||
|&emsp;&emsp;birthday|出生日期|string||
|&emsp;&emsp;nation|民族|string||
|&emsp;&emsp;nativePlace|籍贯|string||
|&emsp;&emsp;homeAddress|家庭住址|string||
|&emsp;&emsp;mailingAddress|通信地址|string||
|&emsp;&emsp;idCardType|证件类型|string||
|&emsp;&emsp;idCardNumber|证件号码|string||
|&emsp;&emsp;socialCardNumber|社保卡号|string||
|&emsp;&emsp;cultureLevel|文化程度|string||
|&emsp;&emsp;politicalOutlook|政治面貌|string||
|&emsp;&emsp;college|毕业院校|string||
|&emsp;&emsp;education|学历|string||
|&emsp;&emsp;eduLength|学制|string||
|&emsp;&emsp;degree|学位|string||
|&emsp;&emsp;phone|手机|string||
|&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;homeTel|家庭电话|string||
|&emsp;&emsp;officeTel|办公电话|string||
|&emsp;&emsp;emergencyContact|紧急联系人|string||
|&emsp;&emsp;emergencyPhone|紧急联系人电话|string||
|&emsp;&emsp;emergencyAddress|紧急联系人地址|string||
|&emsp;&emsp;lastLoginIp|上次登录ip|string||
|&emsp;&emsp;lastLoginAddress|上次登录地点|string||
|&emsp;&emsp;lastLoginTime|上次登录时间|string(date-time)||
|&emsp;&emsp;lastLoginDevice|上次登录设备|string||
|&emsp;&emsp;latestLoginIp|最新登录ip|string||
|&emsp;&emsp;latestLoginAddress|最新登录地点|string||
|&emsp;&emsp;latestLoginTime|最新登录时间|string(date-time)||
|&emsp;&emsp;latestLoginDevice|最新登录设备|string||
|&emsp;&emsp;userStatus|用户状态|string||
|&emsp;&emsp;sortCode|排序码|integer(int32)||
|&emsp;&emsp;extJson|扩展信息|string||
|&emsp;&emsp;identityType|人员身份：0.访客；1.新生；2.在校生；3.校友（毕业生）；4.教职工|string||
|&emsp;&emsp;stuNo|学生的学号|string||
|&emsp;&emsp;stuCollegeName|学生的学院名称|string||
|&emsp;&emsp;stuCollegeCode|学生的学院代码|string||
|&emsp;&emsp;stuMajorName|学生的专业名称|string||
|&emsp;&emsp;stuClassName|学生的班级名称|string||
|&emsp;&emsp;stuStatus|学生的学籍状态|string||
|&emsp;&emsp;stuActivatedStatus|学生的激活状态|string||
|&emsp;&emsp;teaNo|教职工的工号|string||
|&emsp;&emsp;teaDeptName|教职工的单位名称|string||
|&emsp;&emsp;teaTitle|教职工的职称|string||
|&emsp;&emsp;teaStatus|教职工的人员状态|string||
|&emsp;&emsp;teaActivatedStatus|教职工的激活状态|string||
|&emsp;&emsp;isHomeCheck|是否在首页选过身份，0.没有；1.选过|string||
|&emsp;&emsp;buttonCodeList|按钮码集合|array|string|
|&emsp;&emsp;mobileButtonCodeList|移动端按钮码集合|array|string|
|&emsp;&emsp;enabled||boolean||

**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"id": "",
		"avatar": "",
		"signature": "",
		"openId": "",
		"platformId": "",
		"account": "",
		"name": "",
		"nickname": "",
		"gender": "",
		"age": "",
		"birthday": "",
		"nation": "",
		"nativePlace": "",
		"homeAddress": "",
		"mailingAddress": "",
		"idCardType": "",
		"idCardNumber": "",
		"socialCardNumber": "",
		"cultureLevel": "",
		"politicalOutlook": "",
		"college": "",
		"education": "",
		"eduLength": "",
		"degree": "",
		"phone": "",
		"email": "",
		"homeTel": "",
		"officeTel": "",
		"emergencyContact": "",
		"emergencyPhone": "",
		"emergencyAddress": "",
		"lastLoginIp": "",
		"lastLoginAddress": "",
		"lastLoginTime": "",
		"lastLoginDevice": "",
		"latestLoginIp": "",
		"latestLoginAddress": "",
		"latestLoginTime": "",
		"latestLoginDevice": "",
		"userStatus": "",
		"sortCode": 0,
		"extJson": "",
		"identityType": "",
		"stuNo": "",
		"stuCollegeName": "",
		"stuCollegeCode": "",
		"stuMajorName": "",
		"stuClassName": "",
		"stuStatus": "",
		"stuActivatedStatus": "",
		"teaNo": "",
		"teaDeptName": "",
		"teaTitle": "",
		"teaStatus": "",
		"teaActivatedStatus": "",
		"isHomeCheck": "",
		"buttonCodeList": [],
		"mobileButtonCodeList": [],
		"enabled": true
	}
}
```
