## 获取当前用户的通知公告分页

**接口地址**:`/fangyuan/client/c/notice/page`

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
|200|OK|CommonResultPageClientNotice|

**响应参数**:

| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- |
|code|状态码|integer(int32)|integer(int32)|
|msg|提示语|string||
|data||PageClientNotice|PageClientNotice|
|&emsp;&emsp;records||array|ClientNotice|
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;&emsp;&emsp;createUser|创建人|string||
|&emsp;&emsp;&emsp;&emsp;createUserName|创建人名称|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;&emsp;&emsp;updateUser|更新人|string||
|&emsp;&emsp;&emsp;&emsp;updateUserName|更新人名称|string||
|&emsp;&emsp;&emsp;&emsp;id|主键|string||
|&emsp;&emsp;&emsp;&emsp;title|标题|string||
|&emsp;&emsp;&emsp;&emsp;image|封面图|string||
|&emsp;&emsp;&emsp;&emsp;content|内容|string||
|&emsp;&emsp;&emsp;&emsp;digest|摘要|string||
|&emsp;&emsp;&emsp;&emsp;type|类型|string||
|&emsp;&emsp;&emsp;&emsp;place|发布位置|string||
|&emsp;&emsp;&emsp;&emsp;status|状态|string||
|&emsp;&emsp;&emsp;&emsp;remark|备注|string||
|&emsp;&emsp;&emsp;&emsp;sortCode|排序|string||
|&emsp;&emsp;&emsp;&emsp;transMap||object||
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;optimizeCountSql||PageClientNotice|PageClientNotice|
|&emsp;&emsp;searchCount||PageClientNotice|PageClientNotice|
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
				"createTime": "",
				"createUser": "",
				"createUserName": "",
				"updateTime": "",
				"updateUser": "",
				"updateUserName": "",
				"id": "",
				"title": "",
				"image": "",
				"content": "",
				"digest": "",
				"type": "",
				"place": "",
				"status": "",
				"remark": "",
				"sortCode": "",
				"transMap": {}
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
