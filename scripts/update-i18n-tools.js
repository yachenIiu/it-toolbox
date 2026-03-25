const fs = require('fs');
const path = require('path');

// 读取所有工具的meta.ts文件
const toolsDir = path.join(__dirname, '../src/tools');
const zhCNPath = path.join(__dirname, '../src/i18n/locales/zh-CN.json');
const enUSPath = path.join(__dirname, '../src/i18n/locales/en-US.json');

// 读取现有的语言文件
let zhCN = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
let enUS = JSON.parse(fs.readFileSync(enUSPath, 'utf8'));

// 确保tools对象存在
if (!zhCN.tools) zhCN.tools = {};
if (!enUS.tools) enUS.tools = {};

// 遍历所有工具目录
fs.readdirSync(toolsDir).forEach(toolDir => {
  const metaPath = path.join(toolsDir, toolDir, 'meta.ts');
  if (fs.existsSync(metaPath)) {
    const metaContent = fs.readFileSync(metaPath, 'utf8');
    
    // 提取工具信息
    const idMatch = metaContent.match(/id: '([^']+)'/);
    const nameMatch = metaContent.match(/name: '([^']+)'/);
    const nameEnMatch = metaContent.match(/nameEn: '([^']+)'/);
    const descriptionMatch = metaContent.match(/description: '([^']+)'/);
    
    if (idMatch && nameMatch && nameEnMatch && descriptionMatch) {
      const id = idMatch[1];
      const name = nameMatch[1];
      const nameEn = nameEnMatch[1];
      const description = descriptionMatch[1];
      
      // 更新中文语言文件
      if (!zhCN.tools[id]) {
        zhCN.tools[id] = {
          name: name,
          description: description
        };
      } else {
        zhCN.tools[id].name = name;
        zhCN.tools[id].description = description;
      }
      
      // 更新英文语言文件
      if (!enUS.tools[id]) {
        enUS.tools[id] = {
          name: nameEn,
          description: description
        };
      } else {
        enUS.tools[id].name = nameEn;
        enUS.tools[id].description = description;
      }
      
      console.log(`Updated ${id}: ${name} / ${nameEn}`);
    }
  }
});

// 保存更新后的语言文件
fs.writeFileSync(zhCNPath, JSON.stringify(zhCN, null, 2));
fs.writeFileSync(enUSPath, JSON.stringify(enUS, null, 2));

console.log('\nLanguage files updated successfully!');
