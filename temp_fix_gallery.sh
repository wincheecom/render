#!/bin/bash
# 使用sed进行精确替换
sed 's/width: 302.66px;/width: 100%;/' /Users/zhouyun/Downloads/funseeks/index.html | sed 's/max-width: 302.66px;/max-width: 100%;/' > /tmp/index_fixed.html

# 移动回原位置
mv /tmp/index_fixed.html /Users/zhouyun/Downloads/funseeks/index.html
