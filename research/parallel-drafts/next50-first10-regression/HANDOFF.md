# 首10只回归三失败：4514 wrapper空上下文回归

## 结论

3项均由本批4514追加精确版本wrapper引入，不是旧业务断言错误。不修改任何原测试或断言。

1. tests/deployed-3432.test.cjs:66：1040.validate([100,44,1])合法旧接口不传m；4514 wrapper直接m.wikiId导致TypeError，原doesNotThrow失败。
2. tests/deployed-3575.test.cjs:59：compileInstances默认上下文m=null；1030的exact4514及白名单读取m.wikiId抛错，导致issue非空，原无issue断言失败。
3. tests/deployed-3577.test.cjs:15：相同1040编译m=null失败，返回operations空，真实疲惫没有执行，原状态断言undefined!==2。

## 最小修复稿

range-effects.production-edits.json仅替换4514追加块内身份读取：

- (m.wikiId??m.id) → (m?.wikiId??m?.id)
- (c.m.wikiId??c.m.id) → (c.m?.wikiId??c.m?.id)

空上下文不属于4514来源，回到原注册表既有语义；实际4514 ID仍逐项检查原hash/revision/index/args，未删除、降低或放开来源校验。此补丁亦修复同一追加块914/1660/1734/108共享exact helper的同根空上下文风险，未扩到其它批次/架构。旧execute本身需要的context仍由旧实现决定，本修复不保证任意缺字段执行合法。

## 验证

原3项具名专项单并发：baseline.log，exit1，0/3。
独占preload内存修复后保持相同3项原测试：fixed-v1.log，exit0，3/3。
命令：node --require ./research/parallel-drafts/next50-first10-regression/preload-fix.cjs --test --test-concurrency=1 --test-name-pattern='3432 1040精确|3575 的真实诅咒|3577 效果1040' tests/deployed-3432.test.cjs tests/deployed-3575.test.cjs tests/deployed-3577.test.cjs

一次有依据修复即通过。没有修改共享文件，没有整库运行，没有后台进程。主代理需完整回归结束后统一应用补丁，并在生产状态重跑所需专项/完整回归；本结果不替代正在执行的失败整库日志。
