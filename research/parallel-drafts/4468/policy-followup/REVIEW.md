# 4468 1767正式policy只读复核

主代理所述方案成立：仅补`completion-policy.cjs`的`checkSource`中`acceptsSourceParameterConflict(...)`成功后的专用else-if，保持引擎原严格门槛和其它既有兼容分支不动。现有1767没有专属分支，会落默认3683/effect2496后为false，故出现唯一argsNum0与原[3,37]不匹配。不是战斗实现失败，不应改来源argsNum或删除两个原参数。

已亲核正式`data/species/4468.json`，唯一key为4468:skill:36391:4：

- pet4468/80f1440f；skill36391/providerseerapi/hashf88eb61a/revisionseerapi:f88eb61a；原index4。
- effect1767/revisionseerapi:d25219b2，metadata.argsNum0，原args[3,37]，模板/原实例描述均“攻击时将对手的能力提升状态视为相应的能力下降状态”。
- 正式sourceDigest：f17ef67e93771faebbb4248d3d49e8c876be4ba29c59242d6530e8fda0ac3a43。
- 正式rawDigest：5f2bac604beb9cd68b3fc6c1f098fce7f163575f227cb55791e9a63a64ee52d2。
- `research/4468-user-confirmed-rules.json`已存在同key、同两digest绑定，exactParameterConfirmation与真实move.sourceParameterConfirmation逐字段相同；Q-N20-4468-002的answerLines逐字为“我的回答：授权\n”。
- 当前确认文件SHA256为7fc2b85161171cbad17c49641e24e159926fcdf6fa270a9a5419eaf1f09337a5；**主代理加入parameterAuthorization后此hash必变，不能继续把当前hash当最终有效hash**。
- 预授权文件research/FIXED50-SCOPED-PREAUTHORIZATION.2026-10-23.txt真实SHA256：ddbaf0b109478e45d1ad3263f87fafcd0a62640863609d648aa1d031a1a2142d。

旧candidate sourceDigest65f00781...仅因保存前source没有storage/local与savedAt，与rawDigest一致；不得把它套到正式绑定。完整正式证据提取`evidence.json`只读生成于本目录。

建议专用分支除引擎已匹配的tuple外，检查snapshot.id/petrevision、entry.key/index、实际sourceDigest等于上述正式值、digest(raw)等于上述正式值、确认绑定同两digest、参数确认对象完全相等、parameterAuthorization的Q002/授权/原tuple/预授权路径及实际文件hash、实际Q002原回答。若选择对完整确认文件作运行时hash锁定，务必在加入parameterAuthorization并完成所有字段后计算最终hash再写到policy；不要把其自身hash写进同一个文件形成循环自引用。否则可将最终确认文件hash保存在外部落实证据，由分支严格匹配回答与参数授权对象；不要伪称旧hash仍有效。

拒绝矩阵建议每项从真实正式snapshot独立clone，保留正确原argsNum0和原[3,37]断言，禁止按actual改预期：

1. 正确正式tuple+确认文件+授权文件通过，operations.params和sourceArgs仍[3,37]，metadata.argsNum仍0。
2. 错speciesId或pet hash；错skillID/hash/revision/provider；错index；错effectID/revision/template/argsNum。
3. 参数[3,36]、[37,3]、[]、[3,37,0]均拒绝，不能因按零参语义执行就容许其它原参。
4. 删除/篡改sourceParameterConfirmation的任一绑定，或确认文件exactParameterConfirmation不一致，拒绝。
5. sourceDigest或rawDigest错误，即使测试自行重算被篡改快照digest也不能扩展预设tuple授权；确认文件binding被篡改也拒绝。
6. parameterAuthorization缺失、QID不同、answer不是授权、tuple或预授权路径/hash改变、实际预授权文件不可读/内容变动均拒绝。
7. Q002原回答被移除或改成未授权，拒绝；若采用完整确认文件hash锁定，其文件任意变动应失败并记录新版本，不复用旧hash。
8. 其他1767真实零参来源仍按原规则验证；其他带参1767即使copy该确认对象亦不获得授权；此前4/440/446/58等精确兼容分支保持原有路径。

本次未执行任何测试/validator/整库，仅只读核对并写本独占policy-followup目录。主代理继续统一实现和验证，不需等待本代理。
