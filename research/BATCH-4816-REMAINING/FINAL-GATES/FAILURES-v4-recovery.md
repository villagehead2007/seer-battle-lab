# v4-recovery 实际失败清单

共1项失败，退出码1；原断言未修改。

4333公共持续用招手动载荷逐项状态矩阵：正常触发，免攻封锁MISS整招无效不追加

定义 tests/deployed-4333.test.cjs:47:1；断言79:162；用招附加最大体力粉伤/hit-block，actual=true，expected=false。

原因：为4940真实1213实际用招分支移除了公共持续载荷的actionPayloadAllowed门槛，误扩大旧来源在命中效果封锁时的触发。

候选25/25仅在隔离模块缓存中验证，未应用到生产。

```text
✖ failing tests:

test at tests\deployed-4333.test.cjs:47:1
✖ 4333公共持续用招手动载荷逐项状态矩阵：正常触发，免攻封锁MISS整招无效不追加 (53923.9377ms)
  AssertionError [ERR_ASSERTION]: 用招附加最大体力粉伤/hit-block
  
  true !== false
  
      at TestContext.<anonymous> (C:\Users\villa\Desktop\seer-battle-lab\tests\deployed-4333.test.cjs:79:162)
      at Test.runInAsyncScope (node:async_hooks:227:14)
      at Test.run (node:internal/test_runner/test:1402:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:974:18)
      at Test.postRun (node:internal/test_runner/test:1542:19)
      at Test.run (node:internal/test_runner/test:1467:12)
      at async Test.processPendingSubtests (node:internal/test_runner/test:974:7) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: true,
    expected: false,
    operator: 'strictEqual',
    diff: 'simple'
  }
npm notice
npm notice New major version of npm available! 11.19.0 -> 12.2.2
npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.2.2
npm notice To update run: npm install -g npm@12.2.2
npm notice

```
