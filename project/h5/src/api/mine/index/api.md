## 获取用户余额信息

**接口地址**:`/fangyuan/client/c/consume/balance`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**: 获取当前用户的余额信息

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
| 暂无参数 | | | | | |

**响应状态**:

| 状态码 | 说明 | schema |
| -------- | -------- | ----- |
| 200 | OK | CommonResultBalanceResponse |

**响应参数**:

| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- |
| code | 状态码 | integer(int32) | integer(int32) |
| msg | 提示语 | string | |
| data | 余额信息 | BalanceResponse | BalanceResponse |
| &emsp;&emsp;wlkh | 物理卡号（卡序列号） | string | |
| &emsp;&emsp;zhlx | 账号类型 | string | |
| &emsp;&emsp;zhlxmc | 账号类型名称 | string | |
| &emsp;&emsp;ye1 | 账号余额 | string | |
| &emsp;&emsp;ye2 | 卡上余额 | string | |
| &emsp;&emsp;klx | 卡类型 | string | |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "wlkh": "1234567890",
    "zhlx": "1",
    "zhlxmc": "学生卡",
    "ye1": "100.50",
    "ye2": "95.30",
    "klx": "校园卡"
  }
}
``` 