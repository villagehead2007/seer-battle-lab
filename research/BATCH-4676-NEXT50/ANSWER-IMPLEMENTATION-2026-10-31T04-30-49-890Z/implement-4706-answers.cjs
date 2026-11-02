const fs=require('fs'),A=__dirname;function edit(f,fn){fs.copyFileSync(f,A+'/4706-before-'+f.split('/').pop(),fs.constants.COPYFILE_EXCL);fs.writeFileSync(f,fn(fs.readFileSync(f,'utf8')));}
edit('dist/range-souls.js',s=>{
 const start=s.indexOf('function opheliaGain4706'),end=s.indexOf('function resetKata1910',start);let part=s.slice(start,end);
 part=part.replace(/if\(c.a.soulId===1901&&st.soleActive\)\{[^}]+\}/,'');
 part=part.replace(/function opheliaSupport4706[^\n]+/,"function opheliaSupport4706(c,kind){const st=opheliaState4706(c.a);if(!st.soleActive||st.stars>=st.cap)return 0;if(st.doubleCharges>0){st.doubleCharges--;return 2;}return 1;}");
 part=part.replace(/const q=c.a.soulState.critStack4706;[^;]+;const amount=\.35\*factor,result=q==='add'\?\(1\+n\*\.1\+amount\)\/\(1\+n\*\.1\):1\+amount;/,"const amount=.35*factor,result=(1+n*.1+amount)/(1+n*.1);");
 part=part.replace(/partial:true,unimplemented:\[[^\]]+\]/,'partial:false,unimplemented:[]');
 part=part.replace(/roundStart\(c\)\{const st=opheliaState4706\(c.a\);if\(st.stars>0\)\{[^}]+\}\}\},beforeIncomingDamage/, 'beforeIncomingDamage');
 part=part.replace(/if\(c.hadAny4706\)\{[^}]+\}/,"if(c.hadSame4706)return;");
 part=part.replace(/const all=c.t.moves.slice\(\),positive=all.filter\(k=>c.t.pp\[k\]>0\);let pool=positive;if\(positive.length<all.length\)\{[^}]+\}/,"let pool=c.t.moves.slice();");
 part=part.replace(/if\(st.stars>0\)\{const q=c.a.soulState.decay4706;[^}]+\}\}/,"if(st.stars>0){st.stars--;st.decayedRound=c.round;}");
 return s.slice(0,start)+part+s.slice(end);
});
edit('dist/range-effects.js',s=>{
 s=s.replace(/function opheliaAttackGrant4706[^\n]+/,"function opheliaAttackGrant4706(c,n,id,index=c.effectInstanceIndex,metadata={}){c.grantAttackNullify(c.a,n,String(id),index,metadata);}");
 s=s.replace(/add\(2236,'afterHit',[^\n]+/,"add(2236,'afterHit',(c,p)=>{const st=c.a.soulState.ophelia4706??(c.a.soulState.ophelia4706={stars:0,cap:4,doubleCharges:0});st.doubleCharges=p[0];},[[1,99]]);");
 return s;
});
edit('dist/souls.js',s=>s.replace(/if\(value>0&&active\(f,'奥菲利娅能力增强失效',f.soulState\?\.calculationRound\?\?1\)\)\{[^}]+\}/,''));
