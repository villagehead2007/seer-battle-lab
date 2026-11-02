# 4633 finalize与append草稿

仅主代理审核后执行。未执行任一脚本，未读live QUESTIONS；只写本独占目录。静态语法已用vm.Script构造确认（未run），实际52条skills schema为string stateRefs，魂印为questions+sharedQuestions+branches，已正确适配。literal ref静态检查无缺失见static-review.json。

顺序：主线先恢复7源回访使独立30/50并核activeProcesses为空；append-4633-questions.cjs；finalize-4633-independent.cjs。两脚本均只允许最新v3完整结果exit0，不复用v1/v2失败。根路径向上定位标记，支持从draft原路径运行或复制到research后运行。

append仅追加001、010与去重公共关联，保存完整draft JSON来源，MD原文按Buffer逐字节保留，不解释已有回答。若append记录已存在或ID已存在会拒绝，勿绕过，应查已保存append证据。

finalize要求此前实际完整前30（包括7fixed恢复），53条、96来源检查，1882唯一多宠；保存待确认pending数据和review，不部署/验收，正式4509不动，独立只加1到31，下一4635第258行。它只记录当前targeted，不将失败的完整npm5当通过；fullnpm6由main另跑。

风险：若主线在本草稿准备后修改FREEZE文档或测试字面名称，脚本会拒绝或P.checkReview失败；先重新审真实证据，不能调低断言。最终run统计从v3结果动态读取，own22+48+3断言防止旧统计误用。TODO构建失败会在status标独立完成之前停止；review/pending文件可能已先写入（同既有finalizer顺序），需主线根据准确失败恢复，不声称原子事务。
