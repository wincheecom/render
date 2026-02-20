-- 添加备注字段到任务表和历史表
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS remark TEXT;
ALTER TABLE history ADD COLUMN IF NOT EXISTS remark TEXT;

-- 验证字段是否添加成功
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name = 'remark';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'history' AND column_name = 'remark';