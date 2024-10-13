# Solana Trading Bot for Telegram

## 简介

一个用于Telegram的Solana交易机器人，功能与 Banana Gun/ PepeBooster 等交易机器人类似。
功能完成度约95%，部署后可以已经可以进行交易，一些设置功能还在使用默认值。

## 技术说明

使用了Nest.js框架，TypeOrm/MySql数据库（你也可以使用Postgresql，我也准备如果部署生产就改用Postgresql)。
交易提交方面使用 Jito，目前测试下来感觉速度不错，交易上链速度很快，成功率高。有些地方为了节约Api使用次数，用了Redis缓存，同时检测交易结果时也用了Redis队列。
暂时还没有做模块间的微服务化，但感觉如果用户量上来之后应该做一下更好。

## 使用说明

```bash
npm install
npm run build
npm run start
```

需要在.env中配置相关参数（数据库，redis，telegram bot token等），具体细节不再赘述。
