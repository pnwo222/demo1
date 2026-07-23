## 获取当前用户的文章分页

**接口地址**:`/fangyuan/client/c/article/page`

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
|200|OK|CommonResultPageClientArticle|

**响应参数**:

| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- |
|code|状态码|integer(int32)|integer(int32)|
|msg|提示语|string||
|data||PageClientArticle|PageClientArticle|
|&emsp;&emsp;records||array|ClientArticle|
|&emsp;&emsp;&emsp;&emsp;id|主键|string||
|&emsp;&emsp;&emsp;&emsp;title|标题|string||
|&emsp;&emsp;&emsp;&emsp;image|封面图，多个用逗号隔开|string||
|&emsp;&emsp;&emsp;&emsp;content|内容|string||
|&emsp;&emsp;&emsp;&emsp;publisherId|发布人id|string||
|&emsp;&emsp;&emsp;&emsp;publisher|发布人|string||
|&emsp;&emsp;&emsp;&emsp;displayMode|展示模式|string||
|&emsp;&emsp;&emsp;&emsp;showStatus|展示状态，展示:ENABLE；隐藏:DISABLED|string||
|&emsp;&emsp;&emsp;&emsp;reviewStatus|审核状态|string||
|&emsp;&emsp;&emsp;&emsp;adviseStatus|推荐状态，推荐:ENABLE；未推荐:DISABLED|string||
|&emsp;&emsp;&emsp;&emsp;adviseReviewStatus|推荐审核状态|string||
|&emsp;&emsp;&emsp;&emsp;sortCode|排序|integer(int32)||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;size||integer(int64)||
|&emsp;&emsp;current||integer(int64)||
|&emsp;&emsp;orders||array|OrderItem|
|&emsp;&emsp;&emsp;&emsp;column||string||
|&emsp;&emsp;&emsp;&emsp;asc||boolean||
|&emsp;&emsp;optimizeCountSql||PageClientArticle|PageClientArticle|
|&emsp;&emsp;searchCount||PageClientArticle|PageClientArticle|
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
				"title": "",
				"image": "",
				"content": "",
				"publisherId": "",
				"publisher": "",
				"displayMode": "",
				"showStatus": "",
				"reviewStatus": "",
				"adviseStatus": "",
				"adviseReviewStatus": "",
				"sortCode": 0,
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
