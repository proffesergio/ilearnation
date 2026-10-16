import test from 'node:test';
import assert from 'node:assert/strict';
import {serializeData} from './serialization.mjs';
test('JSON cannot break out of its inert script container',()=>{
 const input={title:'</script><script>alert(1)</script>',text:'\u2028'};
 const encoded=serializeData(input);
 assert.equal(encoded.includes('<'),false);
 assert.deepEqual(JSON.parse(encoded),input);
});
