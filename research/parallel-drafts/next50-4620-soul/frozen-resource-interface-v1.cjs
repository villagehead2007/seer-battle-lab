'use strict';
// Frozen RESOURCE-ONLY interface. Full soul entry PP/traits are intentionally NOT represented by this isolated payload-test fixture.
const lit1826=f=>f.soulState.candleLit1826!==false;
const ignite1826=c=>{const changed=!lit1826(c.a);c.a.soulState.candleLit1826=true;return changed;};
const extinguish1826=c=>{const changed=lit1826(c.a);c.a.soulState.candleLit1826=false;return changed;};
module.exports={name:'孤烛灯使',sourceHash:'b5a2035a',partial:true,unimplemented:['resource-only fixture: full1826 entryPP andrank behaviors not included'],abilities:{candleLit:c=>lit1826(c.a),ignite:ignite1826,extinguish:extinguish1826},hooks:{battleStart(c){c.a.soulState.candleLit1826=true;}}};
