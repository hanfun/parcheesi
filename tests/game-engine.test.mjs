import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,activeColor,coordinate,TRACK,START,legalMoves,roll,move,END} from '../assets/game-engine.js';

test('bàn đua có 52 ô; hỗ trợ 2–4 người',()=>{
 assert.equal(TRACK.length,52);
 assert.equal(createMatch(1).players.length,2);
 assert.equal(createMatch(3).players.length,3);
 assert.equal(createMatch(9).players.length,4);
});

test('chưa có quân: tung 1..5 mất lượt; tung 6 được xuất',()=>{
 const start=createMatch(2);
 const skipped=roll(start,4);
 assert.equal(activeColor(skipped),'green');
 assert.equal(skipped.phase,'roll');
 const six=roll(start,6);
 assert.equal(legalMoves(six).length,4);
 const entered=move(six,0);
 assert.equal(entered.game.tokens.blue[0],0);
 assert.deepEqual(entered.route,[coordinate('blue',0)]);
 assert.equal(activeColor(entered.game),'blue');
});

test('quân đi từng bước, không đi vượt quá đích',()=>{
 const m=createMatch(2);
 m.tokens.blue[0]=20;
 m.phase='move';
 m.die=4;
 const result=move(m,0);
 assert.equal(result.route.length,4);
 assert.equal(result.game.tokens.blue[0],24);
 const blocked=createMatch(2);
 blocked.tokens.blue[0]=53;
 blocked.phase='move';
 blocked.die=6;
 assert.ok(legalMoves(blocked).every(a=>a.index!==0));
});

test('không đứng trùng ô cùng màu trên đường chạy',()=>{
 const m=createMatch(2);
 m.tokens.blue=[1,2,-1,-1];m.phase='move';m.die=1;
 assert.ok(legalMoves(m).every(a=>a.index!==0));
});

test('đá quân đối thủ khi dừng đúng ô trên đường chính',()=>{
 const m=createMatch(2);
 m.tokens.blue[0]=0;
 m.tokens.green[0]=(START.blue+1-START.green+TRACK.length)%TRACK.length;
 m.phase='move';m.die=1;
 const result=move(m,0);
 assert.equal(result.captured.length,1);
 assert.equal(result.game.tokens.green[0],-1);
});

test('ra 6 được thêm lượt sau khi đi',()=>{
 const m=createMatch(2);
 m.tokens.blue[0]=1;m.phase='move';m.die=6;
 const result=move(m,0);
 assert.equal(activeColor(result.game),'blue');
 assert.equal(result.game.phase,'roll');
});

test('bốn quân vào đích thì kết thúc ván',()=>{
 const m=createMatch(2);
 m.tokens.blue=[END-1,END,END,END];
 m.phase='move';m.die=1;
 const result=move(m,0);
 assert.equal(result.game.winner,'blue');
 assert.equal(result.game.phase,'done');
 assert.ok(result.victory);
});


test('đường chạy + lối vào chuồng liền nhau cho cả bốn màu',()=>{
 const colors=['blue','green','red','yellow'];
 for(const color of colors){
  for(let p=0;p<END;p++){
   const [r1,c1]=coordinate(color,p),[r2,c2]=coordinate(color,p+1);
   assert.equal(Math.max(Math.abs(r1-r2),Math.abs(c1-c2)),1,
    `Đường đi ${color} bước ${p}->${p+1} không liền kề`);
   // Bốn góc của đường đua nối chéo; đoạn rẽ vào chuồng phải đi ngang/dọc.
   if(p===51) assert.equal(Math.abs(r1-r2)+Math.abs(c1-c2),1);
  }
 }
});
