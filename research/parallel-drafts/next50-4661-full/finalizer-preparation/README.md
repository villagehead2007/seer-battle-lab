# 第45/48只审核映射草稿

本目录只生成独占JSON候选，不应用SINGLE-STAGE-REVIEWS，不写共享状态、原QUESTIONS、数据或进度，不导入引擎，不运行测试/正式validator。

- `4662-review-mapping.draft.json`：45号，49源inventory全部对应；原basic/effect非正式key规范为completion-policy.inventory真实key。空基础描述以当前真实move字段回填。魂1866四类引用细化为其真实分支，并另列branchEvidence。1纯换宠条目1478无假状态引用。问题1新8公共关联保留。
- `4669-review-mapping.draft.json`：48号，49源inventory全部对应；逐项手工四类引用。新增7具名边界准确映射`tests/next50-4669-coverage-followup.test.cjs`。魂1872首次/当前载荷完整单体，只有真实换宠再次登场延期；2144纯换宠。问题2新10公共关联。
- 两者每条均包含真实sourceDigest/raw/source、move/effect/soul hash、索引和参数。mappingAudit记录来源相等与具名callback内非constant直接assert的文本检查，**不等于战斗通过或正式校验通过**。生产文件尚未存在时只定位冻结生产副本文本，记录resolvedEvidenceFile与targetFile，不伪称目标已执行。

48原questions生成器以`gap.includes(String(effectId))`产生了数字子串误关联，将4/5等普通词条错误挂入首触、晚杀等问题。本草稿以冻结实现的具体guard/实际载荷关系显式列出关联，并保留originalAssociatedKeys供对照；没有修改原冻结问题。尤其006补魂短回命重授，004晚杀只关联当前933/1719与预授1924，011首触仅1766/1924，002清除顺序仅1872。

45主代理报告生产v1失败14项属191覆盖旧parser/direct，主已另备兼容修复，最终须用主v2真实结果。此映射不引用任何生产通过门槛、不推进完成状态。

生成器为纯元数据辅助：`build-mapping-draft.cjs`导出build45，`build-4669-mapping-draft.cjs`导出build48；直接执行仅写本目录draft JSON。只调用completion-policy.inventory；namedAssertionTest从本地policy复制成词法检查，不调用checkReview/checkSource/validateCoverage。源的SHA与冻结文件逐一比对，无引擎执行。

父应用前需再次核验当时生产测试文件/修复后的SHA与实际专项结果，检查四类引用的语义。严禁将本草稿直接视为已验收结果。
