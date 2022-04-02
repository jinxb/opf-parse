
const fs = require('fs');
const { readOPF } = require('open-packaging-format');
const connection = require('./src/database');
const baseUrl = 'H:\\paper\\bookDemo\\resource\\epub2'
// let i = 'id'
const target = {}

function getValue(flag, item) {
  if (flag) {
    return item[0]['_']
  } else {
    if (item) {
      const value = item instanceof Array ? item[0] : item
      return (typeof value === 'object') ? value['_'] : value
    } else {
      return ''
    }
  }
}

async function readOpf(path, result, dirFile) {
    result = result[dirFile]
    let files = fs.readdirSync(path)
    for (let i = 0 ; i < files.length ; i++) {
      if (files[i] === 'cover.jpg') {
        result['cover'] = `/${dirFile}/cover.jpg`
      }
      if (files[i] === 'content.opf' || files[i] === 'fb.opf') {
        result['rootFile'] = result['rootFile'] ? (files[i] === 'fb.opf' ? 'OPS/fb.opf' : result['rootFile']) : (files[i] === 'fb.opf' ? 'fb.opf' : 'content.opf')
        // await getss(`${path}\\${files[i]}`, result)
        const opf = await readOPF(`${path}\\${files[i]}`)
          result['cover'] = result['cover'] ? result['cover'] : 'cover/cover.jpg'
          result['title'] = getValue(target[dirFile]['OPFtype'], opf.metadata['dc:title'])
          result['creator'] = getValue(target[dirFile]['OPFtype'], opf.metadata['dc:creator'])
          result['description'] = getValue(false, opf.metadata['dc:description'])
          result['publisher'] = getValue(false, opf.metadata['dc:publisher'])
          // result['language'] = (opf.metadata['dc:language'])
          // result['date'] = opf.metadata['dc:date'][0]
          // result['contributor'] = opf.metadata['dc:contributor'][0]
          // result['identifier'] = opf.metadata['dc:identifier']
          // result['subject'] = opf.metadata['dc:subject']
      } else if (files[i] === 'OPS' || files[i] === 'OEBPS') {
        const opsPath = `${path}\\${files[i]}`
        // 加rootFile路径
        target[dirFile]['rootFile'] = files[i] === 'OPS' ? 'OPS/content.opf' : 'OEBPS/content.opf'
        target[dirFile]['OPFtype'] = files[i] === 'OEBPS' ? true : false
        readOpf(opsPath, target, dirFile)
      }
    }
}

async function executer() {
  const filesss = fs.readdirSync(baseUrl)
  for (let i = 0 ; i < filesss.length ; i++) {
    if (filesss[i].indexOf('201') !== -1) {
      continue
    }
    // // 1、拿到籍文件夹
    target[filesss[i]] = {}
    // 2、遍历拿到文件夹下的所有文件
    const path = `${baseUrl}\\${filesss[i]}`
    // 3、找到opf文件，将解析出来的meta数据放入result对象中
    await readOpf(path, target, filesss[i])
  }
  // 测试：将书籍存入json文件进行查看
  // fs.writeFileSync('./data.json', `, ${JSON.stringify(target)}`, { flag: 'a' })
  // console.log(Object.keys(target).length);
   Object.values(target).forEach(item => {
     const statement = `INSERT INTO book VALUES (${i++}, '${item.title}', '${item.cover}', '${item.description}', '${item.creator}', '${item.publisher}', '${item.title}', 11, 'Literature', 'cn', '${item.rootFile}');`;
     connection.execute(statement).then(result => {
      console.log(result);
     });
   })
}

executer()
// module.exports = target