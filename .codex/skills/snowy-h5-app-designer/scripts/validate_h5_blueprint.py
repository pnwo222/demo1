#!/usr/bin/env python3
from pathlib import Path
import re
import sys

REQUIRED = [
    "原始需求摘录",
    "原子需求清单",
    "页面路由",
    "入口与返回路径",
    "页面类型",
    "主参考源码",
    "页面状态",
    "自动标注",
    "验收",
]
VAGUE = ["等字段", "相关操作", "通用状态", "同上一页", "其他字段", "多条件筛选"]


def main() -> int:
    if len(sys.argv) != 2:
        print("用法: validate_h5_blueprint.py <蓝图.md>")
        return 2
    path = Path(sys.argv[1])
    text = path.read_text(encoding="utf-8")
    errors = []
    if not re.search(r"^## 页面：\S+", text, re.M):
        errors.append("缺少“## 页面：<页面名称>”")
    for heading in REQUIRED:
        if heading not in text:
            errors.append(f"缺少必填项：{heading}")
    for phrase in VAGUE:
        if phrase in text:
            errors.append(f"禁止压缩表达：{phrase}")
    if "| 来源 |" not in text and "|来源|" not in text.replace(" ", ""):
        errors.append("字段表缺少来源列")
    if "project/h5/src/views/" not in text:
        errors.append("未登记实际业务页面参考源码")
    if errors:
        print("H5 蓝图校验失败:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("H5 蓝图校验通过")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
