/**
 * 简化数据库模块 - 使用 JSON 文件存储数据
 * 用于在没有 PostgreSQL 的环境下运行应用
 */

const fs = require('fs').promises;
const path = require('path');

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'data.json');

// 默认数据结构
const DEFAULT_DATA = {
  products: [],
  tasks: [],
  history: [],
  activities: [],
  users: []
};

class SimpleDB {
  constructor() {
    this.data = { ...DEFAULT_DATA };
    this.loadFromFile();
  }

  // 从文件加载数据
  async loadFromFile() {
    try {
      const fileContent = await fs.readFile(DATA_FILE, 'utf8');
      if (fileContent.trim() === '') {
        // 如果文件为空，使用默认数据
        this.data = { ...DEFAULT_DATA };
      } else {
        this.data = JSON.parse(fileContent);
      }
      
      // 确保用户表存在并初始化默认用户
      await this.initializeUsers();
    } catch (error) {
      // 文件不存在或格式错误，使用默认数据
      this.data = { ...DEFAULT_DATA };
      
      // 初始化用户数据
      await this.initializeUsers();
      
      await this.saveToFile();
    }
  }
  
  // 初始化用户数据
  async initializeUsers() {
    if (!this.data.users) {
      this.data.users = [];
    }
    
    if (this.data.users.length === 0) {
      // 添加默认用户
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      
      // 为不同角色创建默认用户
      const adminPasswordHash = await bcrypt.hash('123456', saltRounds);
      const salesPasswordHash = await bcrypt.hash('123456', saltRounds);
      const warehousePasswordHash = await bcrypt.hash('123456', saltRounds);
      
      this.data.users.push(
        {
          id: Date.now().toString() + '_admin', // 简单的 ID 生成
          email: 'admin@example.com',
          password_hash: adminPasswordHash,
          name: '管理员',
          role: 'admin',
          company_name: '公司名称',
          currency: 'USD',
          language: 'en',
          settings: {},
          is_active: true,
          last_login: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: Date.now().toString() + '_sales',
          email: 'sales@example.com',
          password_hash: salesPasswordHash,
          name: '销售运营',
          role: 'sales',
          company_name: '公司名称',
          currency: 'USD',
          language: 'en',
          settings: {},
          is_active: true,
          last_login: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: Date.now().toString() + '_warehouse',
          email: 'warehouse@example.com',
          password_hash: warehousePasswordHash,
          name: '仓库管理',
          role: 'warehouse',
          company_name: '公司名称',
          currency: 'USD',
          language: 'en',
          settings: {},
          is_active: true,
          last_login: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      );
      
      console.log('已添加默认用户数据');
      await this.saveToFile();
    }
  }

  // 保存数据到文件
  async saveToFile() {
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  }

  // 查询数据
  async query(sql, params = []) {
    // 模拟 SQL 查询，根据查询语句返回对应数据
    if (sql.includes('SELECT * FROM products')) {
      return {
        rows: this.data.products,
        rowCount: this.data.products.length
      };
    } else if (sql.toLowerCase().includes('select') && sql.includes('FROM products') && sql.includes('WHERE') && params.length > 0) {
      // 处理带 WHERE 子句的 SELECT 查询，例如: SELECT id FROM products WHERE "id" = $1
      const whereClause = sql.substring(sql.indexOf('WHERE')).toLowerCase();
      let filteredProducts = [];
      
      if (whereClause.includes('id') && params.length > 0) {
        // 提取 WHERE 条件中的值
        const productId = params[0];
        filteredProducts = this.data.products.filter(p => p.id == productId);
      }
      
      return {
        rows: filteredProducts,
        rowCount: filteredProducts.length
      };
    } else if (sql.includes('INSERT INTO products')) {
      // 解析参数并插入产品
      const [, product_code, product_name, product_supplier, quantity, purchase_price, sale_price] = params;
      const newProduct = {
        id: Date.now().toString(), // 简单的 ID 生成
        product_code,
        product_name,
        product_supplier,
        quantity: parseInt(quantity),
        purchase_price: parseFloat(purchase_price),
        sale_price: parseFloat(sale_price),
        created_at: new Date().toISOString()
      };
      this.data.products.push(newProduct);
      await this.saveToFile();
      return {
        rows: [newProduct],
        rowCount: 1
      };
    } else if (sql.includes('SELECT * FROM tasks')) {
      return {
        rows: this.data.tasks,
        rowCount: this.data.tasks.length
      };
    } else if (sql.includes('INSERT INTO tasks')) {
      const [, task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image, manual_image, other_image, creator_name] = params;
      const newTask = {
        id: Date.now().toString(),
        task_number,
        status,
        items: typeof items === 'string' && items ? JSON.parse(items) : items,
        body_code_image,
        barcode_image,
        warning_code_image,
        label_image,
        manual_image,
        other_image,
        creator_name,
        created_at: new Date().toISOString()
      };
      this.data.tasks.push(newTask);
      await this.saveToFile();
      return {
        rows: [newTask],
        rowCount: 1
      };
    } else if (sql.includes('UPDATE tasks SET') && sql.includes('WHERE "id" = $')) {
      // 解析更新字段和值
      const values = [...params]; // 复制参数数组
      const taskId = values.pop(); // 最后一个参数是ID
      
      // 查找任务
      const taskIndex = this.data.tasks.findIndex(t => t.id == taskId);
      if (taskIndex !== -1) {
        // 获取要更新的字段（除了id之外的所有字段）
        const updateFields = {};
        const fieldNames = ['task_number', 'status', 'items', 'body_code_image', 'barcode_image', 'warning_code_image', 'label_image', 'manual_image', 'other_image', 'creator_name'];
        
        // 根据参数顺序分配字段值
        for (let i = 0; i < Math.min(values.length, fieldNames.length); i++) {
          if (values[i] !== undefined) {
            updateFields[fieldNames[i]] = values[i];
          }
        }
        
        // 更新任务对象
        this.data.tasks[taskIndex] = { ...this.data.tasks[taskIndex], ...updateFields };
        await this.saveToFile();
        
        return {
          rows: [this.data.tasks[taskIndex]],
          rowCount: 1
        };
      } else {
        return { rowCount: 0 };
      }
    } else if (sql.includes('SELECT * FROM history')) {
      return {
        rows: this.data.history,
        rowCount: this.data.history.length
      };
    } else if (sql.includes('INSERT INTO history')) {
      const [, task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image, manual_image, other_image, completed_at] = params;
      const newHistory = {
        id: Date.now().toString(),
        task_number,
        status,
        items: typeof items === 'string' && items ? JSON.parse(items) : items,
        body_code_image,
        barcode_image,
        warning_code_image,
        label_image,
        manual_image,
        other_image,
        created_at: new Date().toISOString(),
        completed_at: completed_at || new Date().toISOString()
      };
      this.data.history.push(newHistory);
      await this.saveToFile();
      return {
        rows: [newHistory],
        rowCount: 1
      };
    } else if (sql.includes('SELECT * FROM activities')) {
      return {
        rows: this.data.activities,
        rowCount: this.data.activities.length
      };
    } else if (sql.includes('INSERT INTO activities')) {
      const [, time, type, details, actor] = params;
      const newActivity = {
        id: Date.now().toString(),
        time,
        type,
        details,
        actor,
        created_at: new Date().toISOString()
      };
      this.data.activities.push(newActivity);
      await this.saveToFile();
      return {
        rows: [newActivity],
        rowCount: 1
      };
    } else if (sql.includes('UPDATE products')) {
      // 处理更新产品库存
      const matches = sql.match(/SET "quantity" = "quantity" - \$(\d+) WHERE "id" = \$(\d+)/);
      if (matches) {
        const quantityParamIndex = parseInt(matches[1]) - 1;
        const idParamIndex = parseInt(matches[2]) - 1;
        const quantityToSubtract = parseInt(params[quantityParamIndex]);
        const productId = params[idParamIndex];
        
        const product = this.data.products.find(p => p.id == productId);
        if (product) {
          product.quantity -= quantityToSubtract;
          await this.saveToFile();
        }
      }
      return { rowCount: 1 };
    } else if (sql.includes('DELETE FROM products WHERE')) {
      const id = params[0];
      const initialLength = this.data.products.length;
      this.data.products = this.data.products.filter(p => p.id != id);
      await this.saveToFile();
      return { rowCount: initialLength - this.data.products.length };
    } else if (sql.includes('DELETE FROM tasks WHERE')) {
      const id = params[0];
      const initialLength = this.data.tasks.length;
      this.data.tasks = this.data.tasks.filter(t => t.id != id);
      await this.saveToFile();
      return { rowCount: initialLength - this.data.tasks.length };
    } else if (sql.includes('COUNT(*) FROM')) {
      if (sql.includes('products')) {
        return { rows: [{ count: this.data.products.length }] };
      } else if (sql.includes('tasks')) {
        return { rows: [{ count: this.data.tasks.length }] };
      } else if (sql.includes('history')) {
        return { rows: [{ count: this.data.history.length }] };
      } else if (sql.includes('activities')) {
        return { rows: [{ count: this.data.activities.length }] };
      } else if (sql.includes('users')) {
        return { rows: [{ count: this.data.users.length }] };
      }
    } else if (sql.includes('SELECT * FROM users')) {
      return {
        rows: this.data.users,
        rowCount: this.data.users.length
      };
    } else if (sql.includes('INSERT INTO users')) {
      // 解析用户插入参数
      const [email, password_hash, name, role, company_name] = params;
      const newUser = {
        id: Date.now().toString(), // 简单的 ID 生成
        email,
        password_hash,
        name,
        role,
        company_name: company_name || '',
        currency: 'USD',
        language: 'en',
        settings: {},
        is_active: true,
        last_login: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.data.users.push(newUser);
      await this.saveToFile();
      return {
        rows: [newUser],
        rowCount: 1
      };
    } else if (sql.includes('UPDATE users SET') && sql.includes('last_login = NOW()') && params.length > 0) {
      // 处理更新最后登录时间
      const userId = params[0];
      const user = this.data.users.find(u => u.id == userId);
      if (user) {
        user.last_login = new Date().toISOString();
        user.updated_at = new Date().toISOString();
        await this.saveToFile();
      }
      return { rowCount: 1 };
    } else if (sql.includes('SELECT * FROM users WHERE email = $1 AND is_active = true')) {
      // 根据邮箱查找活跃用户
      const email = params[0];
      const user = this.data.users.find(u => u.email === email && u.is_active === true);
      return {
        rows: user ? [user] : [],
        rowCount: user ? 1 : 0
      };
    } else if (sql.includes('SELECT id FROM users WHERE email = $1')) {
      // 检查邮箱是否已存在
      const email = params[0];
      const user = this.data.users.find(u => u.email === email);
      return {
        rows: user ? [user] : [],
        rowCount: user ? 1 : 0
      };
    } else if (sql.includes('SELECT id, email, name, role, company_name, currency, language, settings, is_active, last_login, created_at, updated_at FROM users WHERE id = $1')) {
      // 获取完整用户信息
      const userId = params[0];
      const user = this.data.users.find(u => u.id == userId);
      return {
        rows: user ? [user] : [],
        rowCount: user ? 1 : 0
      };
    } else if (sql.toUpperCase().includes('BEGIN')) {
      // 事务开始 - 在简化数据库中忽略
      return { rows: [], rowCount: 0 };
    } else if (sql.toUpperCase().includes('COMMIT')) {
      // 事务提交 - 在简化数据库中忽略
      return { rows: [], rowCount: 0 };
    } else if (sql.toUpperCase().includes('ROLLBACK')) {
      // 事务回滚 - 在简化数据库中忽略
      return { rows: [], rowCount: 0 };
    }

    return { rows: [], rowCount: 0 };
  }

  // 专门的更新方法
  async update(table, id, updates) {
    if (table === 'products') {
      const index = this.data.products.findIndex(p => p.id == id);
      if (index !== -1) {
        this.data.products[index] = { ...this.data.products[index], ...updates };
        await this.saveToFile();
        return { rows: [this.data.products[index]], rowCount: 1 };
      }
    } else if (table === 'tasks') {
      const index = this.data.tasks.findIndex(t => t.id == id);
      if (index !== -1) {
        this.data.tasks[index] = { ...this.data.tasks[index], ...updates };
        await this.saveToFile();
        return { rows: [this.data.tasks[index]], rowCount: 1 };
      }
    }
    return { rowCount: 0 };
  }

  // 专门的删除方法
  async delete(table, id) {
    let initialLength;
    if (table === 'products') {
      initialLength = this.data.products.length;
      this.data.products = this.data.products.filter(p => p.id != id);
    } else if (table === 'tasks') {
      initialLength = this.data.tasks.length;
      this.data.tasks = this.data.tasks.filter(t => t.id != id);
    }
    
    await this.saveToFile();
    return { rowCount: initialLength - (table === 'products' ? this.data.products.length : this.data.tasks.length) };
  }
}

// 创建实例
const db = new SimpleDB();

// 导出查询方法
module.exports = {
  query: (text, params) => db.query(text, params),
  update: (table, id, updates) => db.update(table, id, updates),
  delete: (table, id) => db.delete(table, id)
};