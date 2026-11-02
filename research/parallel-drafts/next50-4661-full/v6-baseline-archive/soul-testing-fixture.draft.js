const originalSoulTest1862=soul1862Factory();
registry[1862]={...originalSoulTest1862,
 traits:Object.fromEntries(Object.entries(originalSoulTest1862.traits??{}).map(([k,v])=>[k,f=>{const setup=globalThis.__seerTest4661Setup;if(setup&&!setup.active[f.side])return undefined;return typeof v==='function'?v(f):v;}])),
 hooks:Object.fromEntries(Object.entries(originalSoulTest1862.hooks??{}).map(([k,v])=>[k,c=>{const setup=globalThis.__seerTest4661Setup;if(setup&&!setup.active[c.a.side])return;if(setup&&c.a.side===0&&k==='battleStart')Object.assign(c.a.soulState,setup.policies);return v(c);}]))
};
