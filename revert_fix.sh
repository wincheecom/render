#!/bin/bash
# 使用awk精确修改，只针对任务卡片的特定部分
awk '
{
    # 替换特定的选择器，不影响其他部分
    gsub(/\([[:space:]]*\.task-flip-container \.task-back \{\)/, ".task-flip-container .task-back {\n            transform: rotateY(180deg);\n            overflow: hidden;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            padding: 10px;\n            box-sizing: border-box;\n            top: 0;\n            left: 0;\n            width: 100%;\n            max-width: 100%;") gsub(/width: 100%;[[:space:]]*max-width: 100%;/, "width: 302.66px;\n            max-width: 302.66px;")
    if (/^[[:space:]]*\.task-flip-container \.task-back \{/) {
        print $0
        print "            transform: rotateY(180deg);"
        print "            overflow: hidden;"
        print "            display: flex;"
        print "            align-items: center;"
        print "            justify-content: center;"
        print "            padding: 10px;"
        print "            box-sizing: border-box;"
        print "            top: 0;"
        print "            left: 0;"
        print "            width: 302.66px;"
        print "            max-width: 302.66px;"
        getline
        while ($0 !~ /^[[:space:]]*}/) {
            getline
        }
        print "        }"
    } else if (/^[[:space:]]*\.task-flip-container \.task-front \{/ && (getline next_line) > 0) {
        print $0
        temp = next_line
        while (temp !~ /^[[:space:]]*}/) {
            if (temp ~ /width:/ && temp ~ /100%/) {
                gsub(/width: 100%/, "width: 302.66px", temp)
            }
            if (temp ~ /max-width:/ && temp ~ /100%/) {
                gsub(/max-width: 100%/, "max-width: 302.66px", temp)
            }
            print temp
            if ((getline temp) <= 0) break
        }
        print "        }"
    } else if (/^[[:space:]]*\.warehouse-tasks-gallery \.task-front \{/ && (getline next_line) > 0) {
        print $0
        temp = next_line
        while (temp !~ /^[[:space:]]*}/) {
            if (temp ~ /width:/ && temp ~ /100%/) {
                gsub(/width: 100%/, "width: 302.66px", temp)
            }
            if (temp ~ /max-width:/ && temp ~ /100%/) {
                gsub(/max-width: 100%/, "max-width: 302.66px", temp)
            }
            print temp
            if ((getline temp) <= 0) break
        }
        print "        }"
    } else {
        # 修复之前的替换
        gsub(/width: 100%;/, "width: 302.66px;")
        gsub(/max-width: 100%;/, "max-width: 302.66px;")
        print $0
    }
}' /Users/zhouyun/Downloads/funseeks/index.html > /tmp/index_fixed.html

# 移动回原位置
mv /tmp/index_fixed.html /Users/zhouyun/Downloads/funseeks/index.html
