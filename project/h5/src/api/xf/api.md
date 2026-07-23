## 获取用户门禁记录列表

**接口地址**:`/fangyuan/client/c/access/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

**请求参数**:

| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|beginTime|开始时间（yyyy-MM-dd HH:mm:ss）|query|true|string||
|endTime|结束时间（yyyy-MM-dd HH:mm:ss）|query|true|string||

**响应状态**:

| 状态码 | 说明 | schema |
| -------- | -------- | ----- |
|200|OK|CommonResultPageClientAccess|

**响应参数**:

| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- |
|code|状态码|integer(int32)|integer(int32)|
|msg|提示语|string||
|data||PageClientAccess|PageClientAccess|
|&emsp;&emsp;records||array|ClientAccess|
|&emsp;&emsp;&emsp;&emsp;id|通行记录id|integer(int32)||
|&emsp;&emsp;&emsp;&emsp;deviceSn|设备序列号|string||
|&emsp;&emsp;&emsp;&emsp;deviceName|设备名称|string||
|&emsp;&emsp;&emsp;&emsp;deviceLocation|设备位置信息|string||
|&emsp;&emsp;&emsp;&emsp;areaName|所属区域名称|string||
|&emsp;&emsp;&emsp;&emsp;eventType|事件类型|string||
|&emsp;&emsp;&emsp;&emsp;passState|通行状态(0.未通过 1.通过)|string||
|&emsp;&emsp;&emsp;&emsp;reason|拒绝通行原因|string||
|&emsp;&emsp;&emsp;&emsp;departName|部门名称|string||
|&emsp;&emsp;&emsp;&emsp;userId|人员id|string||
|&emsp;&emsp;&emsp;&emsp;userName|用户名|string||
|&emsp;&emsp;&emsp;&emsp;workId|工号|string||
|&emsp;&emsp;&emsp;&emsp;authenType|验证方式|integer(int32)||
|&emsp;&emsp;&emsp;&emsp;authenTypeStr|验证方式|string||
|&emsp;&emsp;&emsp;&emsp;authenTime|识别时间（yyyy-MM-dd HH:mm:ss）|string||
|&emsp;&emsp;&emsp;&emsp;capPhotoUrl|现场照片地址|string||
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;optimizeCountSql||PageClientAccess|PageClientAccess|
|&emsp;&emsp;searchCount||PageClientAccess|PageClientAccess|
|&emsp;&emsp;optimizeJoinOfCountSql||boolean||
|&emsp;&emsp;maxLimit||integer(int64)||
|&emsp;&emsp;countId||string||
|&emsp;&emsp;pages||integer(int64)||

**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"records": [
			{
				"id": 0,
				"deviceSn": "",
				"deviceName": "",
				"deviceLocation": "",
				"areaName": "",
				"eventType": "",
				"passState": "",
				"reason": "",
				"departName": "",
				"userId": "",
				"userName": "",
				"workId": "",
				"authenType": 0,
				"authenTypeStr": "",
				"authenTime": "",
				"capPhotoUrl": ""
			}
		],
		"total": 0,
		"size": 0,
		"current": 0,
		"orders": [
			{
				"column": "",
				"asc": true
			}
		],
		"optimizeCountSql": {},
		"searchCount": {},
		"optimizeJoinOfCountSql": true,
		"maxLimit": 0,
		"countId": "",
		"pages": 0
	}
}
```
