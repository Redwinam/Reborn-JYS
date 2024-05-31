import { ref } from "vue";
import { Commit } from "vuex";
import { showEventDialog } from "../../components/composables/gameRefs";
import { Achievement } from "../achievements";

interface SpecialEventDetail {
  title: string;
  intro: string;
  options: string[];
}

export const specialEventDetail = ref<SpecialEventDetail | null>(null);

export async function specialEvent(context: { rootState: any; commit: Commit; dispatch: Function; getters: any }, event: string) {
  context.commit("addHappenedEvent", event);

  if (event === "姜哥，玩挺好") {
    specialEventDetail.value = {
      title: "姜哥，玩挺好",
      intro: "这天，姜云升在家陪女朋友，心情很好，忽然想玩点不一样的。决定外卖买个黑丝，外卖订单留哪一个名字呢？",
      options: ["【就叫姜云升！】", "【叫姜云升要谦虚】", "【叫姜云升很行】", "【叫不如姜云升】", "【除了姜云升，叫什么都行】"],
    };
  } else if (event === "生日快乐") {
    const age = Math.floor((context.rootState.round - 16) / 36) + 16;
    specialEventDetail.value = {
      title: "生日快乐",
      intro: "今天是姜云升的" + age + "岁生日……",
      options: ["【祝他生日快乐！！】"],
    };
  } else if (event === "去看热闹") {
    specialEventDetail.value = {
      title: "去看热闹",
      intro: "忽然姜云升听见远处一阵热闹，姜云升决定……”",
      options: ["【去看热闹】", "【不感兴趣】"],
    };
  } else if (event === "十年") {
    specialEventDetail.value = {
      title: "十年",
      intro: "游戏进程达到十年。你想起了曾经鼓舞到你的那首歌。「如果没人跟着起舞，我们怎么革命。」——《十年》",
      options: ["【继续游戏】"],
    };
  } else if (event === "放松，呼吸") {
    specialEventDetail.value = {
      title: "放松，呼吸",
      intro: "春暖花开，万物复苏，你的好朋友约你出门旅游，要去散散心吗？",
      options: ["【去丽江旅游】", "【打死不去】"],
    };
  } else if (event === "记姜云升账上") {
    specialEventDetail.value = {
      title: "记姜云升账上",
      intro: "你的好朋友邀请你参加他的婚礼，你要去参加吗？",
      options: ["【去参加！】", "【谨慎参加】"],
    };
  } else if (event === "二八分") {
    const isAchUnlocked = context.getters.unlockedAchievement("二八分");
    if (!isAchUnlocked) {
      specialEventDetail.value = {
        title: "二八分",
        intro: "有公司欣赏你的说唱才华，希望与你签约。签约经纪公司你可能会接触到非常多的专业资源，收入与知名度也会有所提升。你选择是否签约？",
        options: ["【签约】", "【再考虑下】"],
      };
    } else {
      specialEventDetail.value = {
        title: "二八分",
        intro: "有公司欣赏你的说唱才华，希望与你签约。签约经纪公司你可能会接触到非常多的专业资源，收入与知名度也会有所提升。你选择是否签约？",
        options: ["【签约】", "【再考虑下】", "【自己开公司】"],
      };
    }
  } else if (event === "包剪锤之王") {
    specialEventDetail.value = {
      title: "包剪锤之王",
      intro: "姜云升今天没有搭讪妹子，姜云升今天想玩包剪锤，要玩吗？",
      options: ["【当然】", "【不感兴趣】"],
    };
  } else {
    return;
  }

  showEventDialog.value = true;
}

export async function specialEventOptionChosen(
  context: {
    rootState: any;
    commit: Commit;
    dispatch: Function;
    getters: any;
  },
  payload: { event: string; option: string }
) {
  if (payload.event === "姜哥，玩挺好") {
    if (payload.option !== "【除了姜云升，叫什么都行】") {
      context.commit("unlockAchievement", payload.event);
      await context.dispatch("typeWriter", [
        "片刻后，外卖小哥咚咚咚敲了敲门，送了外卖，看到你开门就笑了，留下了一句“姜哥，玩挺好”。",
        "恭喜，姜云升解锁了第" + context.getters.UnlockedAchievementCount + "个成就【" + payload.event + "】。",
      ]);
    }
  } else if (payload.event === "生日快乐") {
    console.log("生日快乐");
    if (context.rootState.round === 16 && context.rootState.term === 1) {
      context.commit("unlockAchievement", payload.event);
      await context.dispatch("typeWriter", ["姜云升的生日过得很开心，恭喜，姜云升解锁了第" + context.getters.UnlockedAchievementCount + "个成就【" + payload.event + "】。"]);
      await context.dispatch("waitAndType", 600);
    } else if (context.rootState.round === 412) {
      if (!context.getters.unlockedAchievement("迄今为止的生命里")) {
        context.commit("unlockAchievement", "迄今为止的生命里");
        await context.dispatch("typeWriter", ["“感谢你们又一年的陪伴……”", "“我又长大一岁啦！”", "姜云升解锁了第" + context.getters.UnlockedAchievementCount + "个成就【迄今为止的生命里】。"]);
        await context.dispatch("waitAndType", 600);
        await context.dispatch("typeWriter", ["姜云升的生日过得很开心。"]);
      } else {
        await context.dispatch("typeWriter", ["“感谢你们在迄今为止的生命里的陪伴……”", "“我又长大一岁啦！”"]);
        await context.dispatch("waitAndType", 600);
        await context.dispatch("typeWriter", ["姜云升的生日过得很开心。"]);
      }
    } else {
      await context.dispatch("typeWriter", ["姜云升的生日过得很开心。"]);
    }
    await context.dispatch("typeWriter", ["姜云升收到了长辈的1000元生日红包！"]);
    await context.dispatch("waitAndType", 600);
    context.commit("updateAttribute", { attribute: "money", value: 1000 });
    await context.dispatch("typeWriter", ["长大一岁了，这一年姜云升又学到了许多，才华+10！", "又长帅了许多，魅力+10！"]);
    context.commit("updateAttribute", { attribute: "talent", value: 10 });
    context.commit("updateAttribute", { attribute: "charm", value: 10 });
    await context.dispatch("waitAndType", 600);
    await context.dispatch("typeWriter", ["又强壮了许多，最大体力值+10！", "体力恢复满格！", "心情恢复满格！"]);
    context.commit("updateAttribute", { attribute: "maxEnergy", value: 10 });
    context.commit("updateAttribute", { attribute: "energy", value: context.rootState.attributes.maxEnergy });
    context.commit("updateAttribute", { attribute: "mood", value: 100 - context.rootState.attributes.mood });
    await context.dispatch("waitAndType", 600);
    await context.dispatch("typeWriter", ["祝姜云升生日快乐！"]);
  } else if (payload.event === "去看热闹") {
    if (payload.option === "【去看热闹】") {
      context.commit("updateAttribute", { attribute: "mood", value: 100 });
      context.commit("updateAttribute", { attribute: "freestyle", value: 1 });
      await context.dispatch("typeWriter", [
        "明明是几个人在那互骂，姜云升却越听越觉得有意思，开心极了，甚至还想加入他们！",
        "这是他第一次在现场看到什么叫说唱Battle。",
        "你选择的路，和他一样吗？",
        "<small>姜云升的freestyle技能值+1，当前freestyle技能等级为【" + context.rootState.attributes.skill.freestyleLevel + "】</small>",
      ]);
    } else {
      await context.dispatch("typeWriter", ["姜云升对此不感兴趣，错过了一次说唱Battle，但是也没有什么大不了的。"]);
    }
  } else if (payload.event === "十年") {
    context.commit("updateAttribute", { attribute: "divine", value: 10 });
    context.commit("unlockAchievement", payload.event);
    await context.dispatch("typeWriter", [
      "「我用十年奋斗，用十年等候，用十年锻炼自己用身体来忍受」",
      "姜云升的???属性值+10。",
      "姜云升解锁了第" + context.getters.UnlockedAchievementCount + "个成就【" + payload.event + "】。",
    ]);
  } else if (payload.event === "放松，呼吸") {
    if (payload.option === "【去丽江旅游】") {
      // 和女朋友和平分手
      context.rootState.hasGirlfriend = false;
      await context.dispatch("waitAndType", 1000);
      // 她女朋友还找人打他，姜云升体力-60，心情-99
      context.commit("updateAttribute", { attribute: "energy", value: Math.max(context.rootState.attributes.energy - 60, -90) });
      context.commit("updateAttribute", { attribute: "mood", value: Math.max(context.rootState.attributes.mood - 99, -99) });
      await context.dispatch("typeWriter", [
        "姜云升开心地出门去玩啦！但在旅游的时候，你忽然有一种奇怪的预感，于是你给女朋友打了许多电话，她都没有接。果不其然，姜云升被绿了。在姜云升和女朋友分手之后，没想到，你女朋友还找人打了你一顿。（本故事基于真实事件改编）",
        "<small>姜云升体力-60，心情-99。</small>",
      ]);

      await context.dispatch("waitAndType", 1000);
      context.commit("unlockAchievement", payload.event);
      await context.dispatch("typeWriter", ["姜云升解锁了第" + context.getters.UnlockedAchievementCount + "个成就【放松，呼吸】。"]);
    } else {
      await context.dispatch("typeWriter", ["姜云升选择了不去丽江旅游，避免了一次巨大的伤害。"]);
    }
  } else if (payload.event === "记姜云升账上") {
    if (payload.option === "【去参加！】" || payload.option === "【谨慎参加】") {
      if (context.rootState.attributes["gold"] > 1) {
        specialEventDetail.value = {
          title: "记姜云升账上",
          intro: "你穿着你的樱花西装🌸带着祝福参加了你的好朋友的婚礼！你守着你的酒瓶子，婚礼现场十分精彩，不愧是Rapper的婚礼！十分地黑怕！",
          options: ["【随一根金条】", "【全随了！】"],
        };
      } else {
        specialEventDetail.value = {
          title: "记姜云升账上",
          intro: "你穿着你的樱花西装🌸带着祝福参加了你的好朋友的婚礼！你守着你的酒瓶子，婚礼现场十分精彩，不愧是Rapper的婚礼！十分地黑怕！",
          options: ["【随一根金条】"],
        };
      }
      showEventDialog.value = true;
    } else if (payload.option === "【随一根金条】") {
      context.commit("updateAttribute", { attribute: "gold", value: -1 });
      context.commit("unlockAchievement", payload.event);
      await context.dispatch("typeWriter", [
        "你随了一根金条，祝福你的朋友们长长久久！",
        "你的粉丝也随了许多金条，全都记在你的账上啦。",
        "恭喜，姜云升解锁了第" + context.getters.UnlockedAchievementCount + "个成就【" + payload.event + "】。",
      ]);
    } else {
      context.commit("updateAttribute", { attribute: "gold", value: -context.rootState.attributes.gold });
      context.commit("unlockAchievement", payload.event);
      await context.dispatch("typeWriter", [
        "老板大气！你随了你所有的金条，祝福你的朋友们长长久久！",
        "你的粉丝也随了许多金条，全都记在你的账上啦！",
        "恭喜，姜云升解锁了第" + context.getters.UnlockedAchievementCount + "个成就【" + payload.event + "】。",
      ]);
    }
  } else if (payload.event === "包剪锤之王") {
    if (payload.option === "【当然】") {
      await context.dispatch("typeWriter", ["这是姜云升最喜欢的游戏，姜云升要让所有人见识见识自己的高超的包剪锤实力！对手出招了，第一局——"]);
      await context.dispatch("waitAndType", 600);
      specialEventDetail.value = {
        title: "包剪锤之王",
        intro: "【第一局】",
        options: ["✊", "✌️", "🖐️"],
      };
      showEventDialog.value = true;
    } else if (payload.option === "✊" || payload.option === "✌️" || payload.option === "🖐️") {
      let intro = specialEventDetail.value?.intro || "";
      let matchRound = 5;
      switch (intro) {
        case "【第一局】":
          matchRound = 1;
          break;
        case "【第二局】":
          matchRound = 2;
          break;
        case "【第三局】":
          matchRound = 3;
          break;
        case "【第四局】":
          matchRound = 4;
          break;
        case "【第五局】":
          matchRound = 5;
          break;
        default:
          matchRound = 5;
          break;
      }

      const choices = ["✊", "✌️", "🖐️"];
      const opponentChoiceOriginal = choices[Math.floor(Math.random() * choices.length)];
      let opponentChoice = opponentChoiceOriginal;
      const playerChoice = payload.option;

      // 获取玩家的 divine 属性
      const divine = context.rootState.attributes.divine || 0;

      // 判断对手原来的选择是否会赢玩家
      let opponentWins = false;
      if ((opponentChoiceOriginal === "✊" && playerChoice === "✌️") || (opponentChoiceOriginal === "✌️" && playerChoice === "🖐️") || (opponentChoiceOriginal === "🖐️" && playerChoice === "✊")) {
        opponentWins = true;
      }

      // 如果对手会赢，并且随机概率小于玩家的 divine/999，则改变对手的选择
      if (opponentWins && Math.random() < divine / 999) {
        if (opponentChoiceOriginal === "✊") {
          opponentChoice = "🖐️"; // 对手出✊会赢，则改成🖐️
        } else if (opponentChoiceOriginal === "✌️") {
          opponentChoice = "✊"; // 对手出✌️会赢，则改成✊
        } else if (opponentChoiceOriginal === "🖐️") {
          opponentChoice = "✌️"; // 对手出🖐️会赢，则改成✌️
        }
      }

      if ((playerChoice === "✊" && opponentChoice === "✌️") || (playerChoice === "✌️" && opponentChoice === "🖐️") || (playerChoice === "🖐️" && opponentChoice === "✊")) {
        if (matchRound < 5) {
          let nextIntro = "";
          switch (matchRound) {
            case 1:
              nextIntro = "【第二局】";
              break;
            case 2:
              nextIntro = "【第三局】";
              break;
            case 3:
              nextIntro = "【第四局】";
              break;
            case 4:
              nextIntro = "【第五局】";
              break;
            default:
              nextIntro = "【第一局】";
          }

          context.commit("updateAttribute", { attribute: "charm", value: 10 * matchRound });

          if (opponentWins) {
            await context.dispatch("typeWriter", `${intro}姜云升出了${playerChoice}，对手不知道为什么出了${opponentChoice}，姜云升赢了这局包剪锤比赛！姜云升魅力+${10 * matchRound}。下一局——`);
          } else {
            await context.dispatch("typeWriter", `${intro}姜云升出了${playerChoice}，对手出了${opponentChoice}，姜云升赢了这局包剪锤比赛！姜云升魅力+${10 * matchRound}。下一局——`);
          }
          await context.dispatch("waitAndType", 600);
          specialEventDetail.value = {
            title: "包剪锤之王",
            intro: nextIntro,
            options: ["✊", "✌️", "🖐️"],
          };
          showEventDialog.value = true;
        } else {
          context.commit("updateAttribute", { attribute: "charm", value: 10 * matchRound });
          context.commit("unlockAchievement", "包剪锤之王");
          await context.dispatch(
            "typeWriter",
            `${intro}姜云升出了${playerChoice}，对手出了${opponentChoice}，姜云升赢了这局包剪锤大赛！姜云升魅力+${10 * matchRound}。姜云升终于让人见识到了自己的包剪锤实力！恭喜姜云升解锁了第${
              context.getters.UnlockedAchievementCount
            }个成就【包剪锤之王】。`
          );
        }
      } else if (playerChoice === opponentChoice) {
        await context.dispatch("typeWriter", `${intro}姜云升出了${playerChoice}，对手也出了${opponentChoice}，这一局打成平手！再来——`);
        await context.dispatch("waitAndType", 600);
        specialEventDetail.value = {
          title: "包剪锤之王",
          intro: intro,
          options: ["✊", "✌️", "🖐️"],
        };
        showEventDialog.value = true;
      } else {
        await context.dispatch("typeWriter", `${intro}姜云升出了${playerChoice}，对手出了${opponentChoice}，姜云升遗憾地输了这局包剪锤大赛！愿赌服输，罚酒一杯，姜云升伤心地喝醉了。`);
        context.commit("updateDrunk", 1);
      }
    } else {
      if (context.getters.unlockedAchievement("包剪锤之王")) {
        await context.dispatch("typeWriter", ["幼稚的游戏。已经是包剪锤之王的姜云升高冷地离开了。"]);
      } else {
        await context.dispatch("typeWriter", ["幼稚的游戏。姜云升高冷地离开了。"]);
      }
    }
  } else if (payload.event === "二八分") {
    if (payload.option === "【签约】") {
      const isAchUnlocked = context.getters.unlockedAchievement(payload.event);
      if (!isAchUnlocked) {
        context.commit("unlockAchievement", payload.event);
        await context.dispatch("typeWriter", [
          "姜云升签约了经纪公司，专业资源和知名度都有所提升，每月还能拿500块基本工资。姜云升解锁了第" +
            context.getters.UnlockedAchievementCount +
            "个成就【" +
            payload.event +
            "】（公司会抽取你接下来所有收入的80%，需一年后才可以申请解约）",
          "<small>姜云升金钱+500，人气+250。</small>",
        ]);
      } else {
        await context.dispatch("typeWriter", [
          "姜云升签约了经纪公司，专业资源和知名度都有所提升，每月还能拿500块基本工资。（公司会抽取你接下来所有收入的80%，需一年后才可以申请解约）",
          "<small>姜云升金钱+500，人气+250。</small>",
        ]);
      }

      context.commit("setSignedAgency", true);
      context.commit("updateAttribute", { attribute: "money", value: 500 * 5 });
      context.commit("updateAttribute", { attribute: "red", value: 250 });
      context.dispatch("incrementRound");
    } else if (payload.option === "【再考虑下】") {
      const isAchUnlocked = context.getters.unlockedAchievement(payload.event);
      if (!isAchUnlocked) {
        context.commit("unlockAchievement", payload.event);
        await context.dispatch("typeWriter", [
          "经过慎重考虑，姜云升还是决定签约经纪公司，姜云升专业资源和知名度都有所提升，每月还能拿500块基本工资。姜云升解锁了第" +
            context.getters.UnlockedAchievementCount +
            "个成就【" +
            payload.event +
            "】（公司会抽取你接下来所有收入的80%，需一年后才可以申请解约）",
          "<small>姜云升金钱+500，人气+250。</small>",
        ]);
      } else {
        await context.dispatch("typeWriter", [
          "经过慎重考虑，姜云升还是决定签约经纪公司，姜云升专业资源和知名度都有所提升，每月还能拿500块基本工资。（公司会抽取你接下来所有收入的80%，需一年后才可以申请解约）",
          "<small>姜云升金钱+500，人气+250。</small>",
        ]);
      }

      context.commit("setSignedAgency", true);
      context.commit("updateAttribute", { attribute: "money", value: 500 * 5 });
      context.commit("updateAttribute", { attribute: "red", value: 250 });
      context.dispatch("incrementRound");
    } else if (payload.option === "【自己开公司】") {
      const isAchUnlocked = context.getters.unlockedAchievement("风炎文化");
      if (!isAchUnlocked) {
        context.commit("unlockAchievement", "风炎文化");
        context.commit("openFengyan", true);
        await context.dispatch("typeWriter", ["“没上过一天正经班，我直接成为董事长。建立个特别的公司，我知道我们能有市场”，姜云升选择自己开一家不一样的经纪公司，解锁成就【风炎文化】。"]);
      } else {
        context.commit("openFengyan", true);
        await context.dispatch("typeWriter", ["“没上过一天正经班，我直接成为董事长。建立个特别的公司，我知道我们能有市场”，姜云升选择自己开一家不一样的经纪公司——风炎文化。"]);
      }
      context.dispatch("incrementRound");
    }
  }
}
