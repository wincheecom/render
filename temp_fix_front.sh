#!/bin/bash
# 使用awk进行替换
awk '
BEGIN { in_block = 0 }
{
    if (/^[[:space:]]*\.task-flip-container \.task-front \{/) {
        # 检查是否是包含width: 302.66px的块
        if ($0 ~ /task-flip-container \.task-front \{/) {
            print $0
            while ((getline next_line) > 0) {
                line = next_line
                if (line ~ /width: 302\.66px;/) {
                    gsub(/width: 302\.66px;/, "width: 100%;", line)
                }
                if (line ~ /max-width: 302\.66px;/) {
                    gsub(/max-width: 302\.66px;/, "max-width: 100%;", line)
                }
                print line
                if (line ~ /^[[:space:]]*}/ && match(line, /^[^}]*}$/)) {
                    break
                }
            }
        } else {
            print $0
        }
    } else if (/^[[:space:]]*\.task-flip-container \.task-back \{/) {
        # 跳过这一行，因为它已经被处理过了
        print $0
        while ((getline next_line) > 0) {
            line = next_line
            print line
            if (line ~ /^[[:space:]]*}/ && match(line, /^[^}]*}$/)) {
                break
            }
        }
    } else {
        print $0
    }
}' /Users/zhouyun/Downloads/funseeks/index.html > /tmp/index_fixed.html

# 移动回原位置
mv /tmp/index_fixed.html /Users/zhouyun/Downloads/funseeks/index.html
