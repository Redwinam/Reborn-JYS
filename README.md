# 重生之我是姜云升

文字游戏，选择玩家角色姜云升行动，在2012年-2023年共计432个轮次中，体验一些简单的小故事。
设计单周目游玩时长约5-15分钟。

游玩地址：https://jys.wtf

## 界面截图

<img src="https://redwinam.coding.net/p/jysx/shared-depot/reborn-as-jiangyunsheng/git/raw/master/src/assets/demo-1.png" alt="游戏主页" width="40%" />
<img src="https://redwinam.coding.net/p/jysx/shared-depot/reborn-as-jiangyunsheng/git/raw/master/src/assets/demo-home.png" alt="回家" width="40%" />

## 机制设计
- [x] 人物属性机制
- [x] 金钱机制
- [x] 回合行动机制
- [x] 外出机制
- [x] 交女朋友、分手机制
- [x] 结局机制
- [x] 写歌机制
- [x] 成就机制
- [x] 物品机制
- [x] 购物、交易机制
## 内容设计
- [ ] 成就图鉴
- [ ] 歌曲清单（已列） - 开发中

## 人物属性

透明属性：
  talent: '才华',
  charm: '魅力',
  popularity: '人气'（红/黑）
  money: '金钱',
  skill: '技能',
  energy: '体力',
  mood: '心情',
  
隐藏属性(1)

## 写歌设计

-[x] 《浪漫主义》：才华值>100，魅力值>100，隐藏属性>100
-[x] 《浪漫主义2.0》：才华值>100，魅力值>100，体力>90
-[x] 《真没睡》：交过10个女朋友，收集物品衣服>5，包包>5；才华>100
-[x] 《孤独面店》：心情值<50；交过2个女朋友分手以后，连续3个月没有再交女朋友，也没有去鬼混把妹
- 《宅》：累计回家超过10次，电竞技能>10
- 《你一定能成为你想要去成为的人》：才华>120，隐藏属性>100，金钱<10000
-[x] 《SAD》：被分手1个月之内，立即外出鬼混，心情<50
- 《反抗》：
- 《爱の小曲》：外出事件随机拍到晚霞>2次，学会声乐技能
- 《想你》：被分手1个月之内，金钱>100000，心情<50，拥有艺人顾帅
- 《网易云》：才华>80，心情<0
- 《这首歌没唱直接听》：freestyle技能>20
- 《拼个世界给自己》：才华>100，巡演获得皮卡丘积木，学会声乐技能
- 《流量Rapper》：人气>1000
- 《舞台上》：Freestyle技能>25，人气>1000，黑人气>500，金钱>2000000
- 《自白书》:2016年1月后，才华>30，魅力>30
- 《皮卡丘》：收集皮卡丘物品>20
- 《Battle》：Freestyle技能>30，参加Battle比赛>10次，获得过冠军
- 《28.7》
- 《天选》：电竞技能>20；

- 《孤注一掷》：才华>100，体力<0
- 《3》：收集皮卡丘物品>10，被分手1个月之内
- 《看透一切》：发歌数量>10，人气>500，隐藏属性>50
- 《日记》：2019年9月；心情<20
- 《云霄》：才华>100，外出上山>10次，隐藏属性>100

- 早期情歌组合：
- 《举步维艰》：体力>80，外出鬼混>2次
- 《遇见你》：体力>80，当前有女朋友

- 《围城》：被分手3个月之后，心情<20
- 《不后悔遇见你》：交过3个女朋友以上，并被分手
- 《呵呵》
- 《患》：交过1个女朋友并分手，才华>80，隐藏属性>50，心情<0

## 技能设计

Freestyle 技能（共计28点）：
   - 常规升级方式：外出通过 Battle 比赛提升
   - 特殊升级方式：事件触发
   - 晋级提问
      问答题：x1 x2 x3
         地面 欲念
         清晨的烟幕
         你一定能够成为你想要去成为的人


电竞技能：
   - 常规升级方式：回家休息打游戏提升 
   - 特殊升级方式：事件触发
   - 晋级提问
      合成大西瓜

技能页面有mapping

## 外出活动

### 吃

外出随机解锁食物，如猪肝面等，每种食物对应的金钱不同，增加体力不同。

## 特殊事件

去掉路费剩126.

## 成就/结局设计
结局（可同时达成多结局）：
- HE
	-[x] 【汤臣一品】：金钱>100000000。
	-[x] 【刀削面子】：累计女友数量>10，发布歌曲《浪漫主义》、《浪漫主义2.0》，结局时没有和当前女朋友分手。
	-[x] 【皮卡皮卡】：累计购买皮卡丘玩偶>520件，且没有发布合作曲《3》，解锁皮卡丘结局，和皮卡丘快乐地生活在一起。
- NE
	-[x] 【一肩明月，两袖清风】：结局时金钱<99999。
- BE
	-[x] 【姜云升虚弱】：体力<-100，透支完毕，结束游戏。
	-[x] 【我不做人啦】：心情<-100，过于emo，结束游戏。



成就：
-[x] 【拜拜就拜拜】：累计被分手10次。
- 【初】：发布专辑初的所有音乐。
- 【被敲碎的小金猪】：
- 【二八分】
-[x] 【小姜的餐馆】：解锁所有美食。
- 【全场奶茶我包了】：失恋后1个月内，去找好吃的，花费金钱100.
-[x] 【这歌废了】：写过超过16次废歌。

-[x] 【我所拥有的人气，又是不是真的？】人气>1200，黑人气>1000。
-[x] 【谢谢你们提醒我吃维生素】收集所有的维生素片
-[x] 【姜哥，玩挺好】在家陪女朋友时随机触发。
-[x] 【时间很长】指的是姜云升的睡眠时间很长，在一轮游戏中累计睡眠时间达到500个小时。
-[x] 【醉酒小姜】不是酒后吐真言，是借着喝醉说心里话。
-[x] 【十年】游戏进程达到10年。


## 编译部署

```
yarn build
docker build -t reborn-jysx-image .
docker save -o reborn-jysx-image.tar reborn-jysx-image
docker load -i /mnt/JYSX/Reborn/reborn-jysx-image.tar
docker run -d --name reborn-jysx-container -p 9147:80 reborn-jysx-image

docker stop reborn-jysx-container
docker rm reborn-jysx-container
```