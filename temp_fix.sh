#!/bin/bash
# 创建备份
cp /Users/zhouyun/Downloads/funseeks/index.html /Users/zhouyun/Downloads/funseeks/index.html.backup.$(date +%s)

# 使用awk进行替换
awk '
BEGIN { in_block = 0 }
{
    if (/^[[:space:]]*\.task-flip-container \.task-back \{/) {
        in_block = 1
    }
    if (in_block && /width: 302\.66px;/) {
        gsub(/width: 302\.66px;/, "width: 100%;")
    }
    if (in_block && /max-width: 302\.66px;/) {
        gsub(/max-width: 302\.66px;/, "max-width: 100%;")
    }
    if (in_block && /^[[:space:]]*}/ && match($0, /^[^}]*}$/)) {
        in_block = 0
    }
    print
}' /Users/zhouyun/Downloads/funseeks/index.html > /tmp/index_fixed.html

# 移动回原位置
mv /tmp/index_fixed.html /Users/zhouyun/Downloads/funseeks/index.html
