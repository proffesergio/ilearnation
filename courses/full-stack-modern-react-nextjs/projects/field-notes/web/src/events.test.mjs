import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeEvents } from './events.mjs';
test('overlapping history and live events merge idempotently',()=>{const a={eventId:'e1',note:{id:'n1'}},b={eventId:'e2',note:{id:'n2'}};assert.deepEqual(mergeEvents([a],[a,b,b,null]),[a,b]);});
