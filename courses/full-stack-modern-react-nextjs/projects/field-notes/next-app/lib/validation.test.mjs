import test from 'node:test';
import assert from 'node:assert/strict';
import {noteInput} from './validation.mjs';
test('server validation trims input and rejects missing/oversized fields',()=>{const f=new FormData();f.set('title','  Observe  ');f.set('body','A repeatable check');assert.equal(noteInput(f).title,'Observe');f.set('title','x'.repeat(121));assert.throws(()=>noteInput(f));f.delete('title');assert.throws(()=>noteInput(f));});
