`PORT=4000 node app` 修改端口号

`mongod` 启动 mongdn

查看当前数据库里数据
mongo
use imooc #当前数据库名字是 imooc
show tables #查看的表
db.users.find({}) #查看所有数据

\# 设置管理员权限
db.users.update({"_id" : ObjectId("57ee297e2f2fa828ad2cb44c"}, {$set: {role: 51}})
