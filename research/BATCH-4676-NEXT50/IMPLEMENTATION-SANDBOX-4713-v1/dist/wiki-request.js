(function(root,factory){const request=factory();if(typeof module==='object'&&module.exports)module.exports=request;else root.BattleDataRequest=request;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
return async function request(provider,route,params,{fetchImpl=globalThis.fetch,protocol=globalThis.location?.protocol??'http:',timeout=240000}={}){
 if(!['http:','https:'].includes(protocol))throw new Error('联网图鉴不能直接打开 HTML 使用。请双击项目中的“启动对战实验台.cmd”，再访问 http://127.0.0.1:61648/。');
 let response;try{response=await fetchImpl('/api/'+provider+'/'+route+'?'+new URLSearchParams(params),{signal:AbortSignal.timeout(timeout)});}catch(error){if(['TimeoutError','AbortError'].includes(error.name))throw new Error('资料查询超时，请稍后重试。当前对局已保留。');throw new Error('无法连接本地对战服务。请运行“启动对战实验台.cmd”，并从 http://127.0.0.1:61648/ 打开页面。当前对局已保留。');}
 let data;try{data=await response.json();}catch{throw new Error('本地接口未返回有效资料（HTTP '+response.status+'）。请确认页面地址为 http://127.0.0.1:61648/。');}
 if(!response.ok)throw new Error(data.error??('资料源暂不可用（HTTP '+response.status+'），请稍后重试。'));
 return data;
};
});
