#!/bin/bash

# 设置起始，结束日期，作者名字
start_date="2023-12-30"
end_date="2024-12-24"
author_name="godkun"

# 验证日期格式
if ! [[ $start_date =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ && $end_date =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "日期格式无效.请使用 YYYY-MM-DD 格式."
  exit 1
fi

# 使用 git log 获取提交列表
if ! git log --since="$start_date" --until="$end_date" --author="$author_name" --pretty=format: --numstat >/dev/null 2>&1; then
  echo "在指定日期范围内找不到提交记录."
  exit 1
fi

git log --since="$start_date" --until="$end_date" --author="$author_name" --pretty=format: --numstat | \
awk -v start_date="$start_date" -v end_date="$end_date" -v author_name="$author_name" '
NF == 3 {
  added+=$1
  removed+=$2
}
END {
  printf "起始时间:%s\n结束时间:%s\n作者:%s\n添加的行数:%s\n删除的行数:%s\n总共改变的行数:%s\n", start_date,end_date,author_name, added, removed, added+removed
}
'
