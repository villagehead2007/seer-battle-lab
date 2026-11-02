// Must run after final legacy2144 definition. Preserve its exact old validation and phase.
const old2144For4661=registry[2144];
function exact2144For4661(p,m,i){return (m?.wikiId??m?.id)===28779&&(m.hash==='244bcd1d'||m.revision==='seerapi:244bcd1d')&&i===0&&JSON.stringify(p)==='[2]';}
registry[2144]={...old2144For4661,validate(p,m,i){if(exact2144For4661(p,m,i))return;return old2144For4661.validate(p,m,i);},deferredFor(p,m,i){return exact2144For4661(p,m,i)?'双方下2回合无法主动切换精灵：真实主动换宠门禁延期':old2144For4661.deferredFor?old2144For4661.deferredFor(p,m,i):old2144For4661.deferred;}};
