{
// 1806 has no self target in the current single-fighter context. Every deferred
// branch below names an actual other party member, switch recipient, or shared
// party ledger. Do not fabricate a link on the owner to execute those branches.
registry[1806]={name:'斯布林蒂',sourceHash:'4b2b51e2',deferred:[
'战斗开始为己方所有其他精灵附加3级未来链接，链接参与未来奇点/未来指令结算；需要真实己方其他成员名单和每成员链接账本，原文排除本体',
'斯布林蒂背包存活时，链接成员受攻击忽略原克制并取己方链接成员最低被克制系数，消费对应成员1级；需要真实队伍链接成员/属性和消费，不凭空授本体链接',
'本体主动下场后按下只链接达到等级依次同步3级体力上限、2级当前体力、1级PP；需要真实主动换宠及下只对象',
'己方其他精灵被击败失去全部未来链接；需要真实其他成员死亡事件',
'本体被击败时清除己方所有未来链接，每实际消除1级给对应成员回300HP/全部PP+1；需要队伍实际链接账本及对应成员，当前本体无链接不凭空复活/恢复'
],traits:{},hooks:{}};

}
