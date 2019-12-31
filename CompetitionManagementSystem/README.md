## 数据库开机

```shell
sudo mongod
sudo mongod --auth # 带权限管理
```
## 设置数据库密码

```shell
mongo
use project
db.createUser({user:'admin',pwd:'admin',roles: [{role:'readWrite',db:'project'}]})
```

## 导入预制竞赛数据表

进入 "server" 文件夹下

```shell
node importExcel.js
```

默认负责人为`t123456`，如需更改，importExcel.js 中更改

默认参赛方式为多人参赛，如需更改，由管理员编辑

## 数据库备份与恢复

进入 "数据库备份恢复" 文件夹下

数据库备份: 

```shell
mongodump -h localhost -d project -o ./mongodump/
```

数据库恢复:

```shell
mongorestore -h localhost -d project --dir ./mongodump/project/ --drop
```

 

