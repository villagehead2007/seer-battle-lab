# 新来源wrapper空m候选补查与1090逐实例延期修复

范围只含本批4509–4535生产追加块和4541冻结技能草稿。无共享修改，无整库运行。

## 有实际旧测试证据并已制作补丁

4514：旧3432直接1040.validate(params)无m；旧3575 compileInstances(instances,definitions)默认m=null；旧3577同1040编译失败致操作为空。见原HANDOFF及baseline/fixed-v1日志。可空身份读取仅恢复旧注册表委托，已知4514 ID仍精确校验。

4535/1090：旧4246测试直接断言registry[1090].deferred包含真实下一只。4535覆盖deferred:undefined删除旧全局语义。并非空m导致，不能用可选链解决。

## 空m静态候选（未扩大修改）

- 4509–4511：未发现本次要求类型的exact45xx来源身份wrapper。
- 4515：exact4515/1878。
- 4516：exact4516/2004、1932、1676。
- 4521：exact4521/2033、1924。
- 4524：exact4524/1586、1400。
- 4532：exact4532/579、690、574。
- 4535：exact4535及521、1232、1090的target；1011/2042..49是本次限定新源的严格注册，不可无来源放宽。
- 4541技能草稿：exact4541及744、602、1613；531/1910限定新源注册不属于恢复通用旧接口。

这些复用wrapper静态上有同形m.wikiId读取，但本轮未检出相应旧无m成功调用断言。找到的旧1932 validate用真实move；其它后期helpers调用validate与compileInstances也传move。按主要求先记录候选，不机械把全部新注册改成无来源可用。尤其1090旧validate本就要求精确旧move，不能把缺m会报错误当成必须放行。

## 1090必要最小接口

combined-production-edits.json是累积补丁，包含原4514修改及：

1. 4535 1090保留old.deferred，增加deferredFor(params,move,index)：仅精确36762/7803bd47/index3/[2]返回undefined，其余返回旧延期说明。
2. dist/effect-registry.js direct编译在validate成功后按可选selector设置操作deferred；其它注册沿旧常量逻辑。
3. research/build-multiplayer-todo.cjs逐实例采集同样用selector，防止新4535误登记真实下一只分支。
4. tests/helpers/4535-battle.cjs是新目标必要的手工direct操作消费者，同样选逐实例deferred，保留原测试断言。

automation-validate使用已编译deferred、local-species处理魂印deferred无需改。其余旧helper不处理新4535实例，不扩大修改。

## 组合验证

独占preload-combined.cjs在内存应用累积补丁，原3失败+旧4246原断言+新增deferred-selector.test.cjs，共5项；combined-v1.log，exit0，5/5。

新增测试同时验证旧4246编译延期、全局旧说明保留、新4535编译无延期、KO仍抛Q002、错误hash仍拒绝、build旧项保留且新项不误延期。没有把新源待答行为错误豁免。

全部草稿冻结；主线待完整回归结束统一应用与生产回归。

## 追加521：实际旧通用测试证据

tests/source-parameter-conflicts.test.cjs 的“2496 completion gate requires actual user confirmation record and ordinary zero args stay strict”明确要求 compileInstances([{id:521,args:[]}],[e]) 在默认 move=null 时成功，非空参数[100]仍拒绝。首10只完整npm记录该原断言因521读取null.wikiId失败。

累积补丁新增4535与4541的521 wrapper，仅将target身份读取改为m?.wikiId??m?.id；无move退回旧验证，不进入新实例分支。已知新ID仍严格hash/revision/index/args，exact辅助函数未放宽。4541的old锚点取冻结技能草稿；必须先整合4541再应用累积补丁。未改共享文件、未修改原测试。

本次追加仅代码准备，遵主线资源安排尚未运行；combined-v1的5/5仅证明追加前版本，不声称覆盖521或4541。待主线安排具名专项窗口。
