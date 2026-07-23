## 获取当前用户的应用分页

**接口地址**:`/fangyuan/client/c/app/page`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:

**请求参数**:

**请求参数**:

| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|current|当前页码|query|false|integer(int32)||
|size|每页条数|query|false|integer(int32)||

**响应状态**:

| 状态码 | 说明 | schema |
| -------- | -------- | ----- |
|200|OK|CommonResultPageClientApp|

**响应参数**:

| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- |
|code|状态码|integer(int32)|integer(int32)|
|msg|提示语|string||
|data||PageClientApp|PageClientApp|
|&emsp;&emsp;records||array|ClientApp|
|&emsp;&emsp;&emsp;&emsp;id|主键|string||
|&emsp;&emsp;&emsp;&emsp;name|应用名称|string||
|&emsp;&emsp;&emsp;&emsp;image|应用图标|string||
|&emsp;&emsp;&emsp;&emsp;url|应用链接|string||
|&emsp;&emsp;&emsp;&emsp;place|可见身份|string||
|&emsp;&emsp;&emsp;&emsp;showStatus|展示状态，展示:ENABLE；隐藏:DISABLED|string||
|&emsp;&emsp;&emsp;&emsp;usedStatus|可用状态，可用:ENABLE；不可用:DISABLED|string||
|&emsp;&emsp;&emsp;&emsp;priorityLevel|优先级，越小越靠前|integer(int32)||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;optimizeCountSql||PageClientApp|PageClientApp|
|&emsp;&emsp;searchCount||PageClientApp|PageClientApp|
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
				"id": "",
				"name": "",
				"image": "",
				"url": "",
				"place": "",
				"showStatus": "",
				"usedStatus": "",
				"priorityLevel": 0,
				"createTime": ""
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
