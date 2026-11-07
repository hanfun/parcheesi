/** Cờ Cá Ngựa offline MVP — luật tách khỏi giao diện và âm thanh.
 * Ruleset tạm thời: 1 xúc xắc, ra 6 xuất quân, ra 6 được thêm lượt,
 * đá quân ở ô đường chính, phải đi đúng số vào đích.
 * Chưa có: vật cản, chuồng 6-5-4-3 đặc thù, ô an toàn, skill, online.
 */
export const COLORS = ['blue', 'green', 'red', 'yellow'];
export const COLOR_NAMES = {blue:'Xanh dương',green:'Xanh lá',red:'Đỏ',yellow:'Vàng'};
export const TRACK = [
 [6,0],[6,1],[6,2],[6,3],[6,4],[6,5],
 [5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,8],
 [1,8],[2,8],[3,8],[4,8],[5,8],
 [6,9],[6,10],[6,11],[6,12],[6,13],[6,14],[7,14],
 [8,14],[8,13],[8,12],[8,11],[8,10],[8,9],
 [9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[14,7],[14,6],
 [13,6],[12,6],[11,6],[10,6],[9,6],
 [8,5],[8,4],[8,3],[8,2],[8,1],[8,0],[7,0]
];
export const START = {blue:14,green:27,red:1,yellow:40};
export const LANES = {
 blue:[[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],
 green:[[7,13],[7,12],[7,11],[7,10],[7,9],[7,8]],
 red:[[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]],
 yellow:[[13,7],[12,7],[11,7],[10,7],[9,7],[8,7]]
};
export const BASES = {
 blue:[[2,2],[2,4],[4,2],[4,4]],
 green:[[2,10],[2,12],[4,10],[4,12]],
 red:[[10,2],[10,4],[12,2],[12,4]],
 yellow:[[10,10],[10,12],[12,10],[12,12]]
};
export const END = 57;

export function createMatch(count = 4) {
 const amount = Math.max(2, Math.min(4, Math.trunc(Number(count) || 4)));
 return {
  ruleset:'vietnamese-offline-mvp-v1',
  players:COLORS.slice(0,amount),
  tokens:Object.fromEntries(COLORS.slice(0,amount).map(c=>[c,[-1,-1,-1,-1]])),
  turn:0, phase:'roll', die:null, rolls:0, winner:null,
  message:'Đến lượt Xanh dương. Hãy tung xúc xắc!'
 };
}
export function activeColor(game) { return game.players[game.turn]; }
export function coordinate(color,progress,index=0) {
 if (progress < 0) return BASES[color][index];
 if (progress <= 51) return TRACK[(START[color]+progress)%TRACK.length];
 return LANES[color][Math.min(5,progress-52)];
}
export function trackIndex(color,progress) {
 return progress>=0 && progress<52 ? (START[color]+progress)%TRACK.length : -1;
}
function destinationAvailable(game,color,index,target) {
 if (target>END) return false;
 if (target===END) return true; // Bốn quân được cùng về đích.
 const myTokens=game.tokens[color];
 if(myTokens.some((p,i)=>i!==index && p===target)) return false;
 return true;
}
export function legalMoves(game,die=game.die) {
 if(game.phase==='done' || !Number.isInteger(die) || die<1 || die>6) return [];
 const color=activeColor(game);
 return game.tokens[color].flatMap((from,index)=>{
  if(from===END) return [];
  if(from===-1 && die!==6) return [];
  const to=from===-1 ? 0 : from+die;
  return destinationAvailable(game,color,index,to) ? [{color,index,from,to}] : [];
 });
}
export function roll(game,die) {
 if(game.phase!=='roll' || !Number.isInteger(die) || die<1 || die>6) throw Error('Lượt tung không hợp lệ');
 const next={...game,die,rolls:game.rolls+1,phase:'move'};
 const moves=legalMoves(next);
 if(moves.length) {
  next.message=`${COLOR_NAMES[activeColor(next)]} tung ${die}. Chọn quân đang nhấp nháy để đi!`;
 } else {
  next.phase='roll';
  next.turn=die===6?game.turn:(game.turn+1)%game.players.length;
  next.message=`Tung ${die} nhưng không có nước đi. ${die===6?'Được tung lại!':`Đến lượt ${COLOR_NAMES[activeColor(next)]}.`}`;
 }
 return next;
}
export function move(game,index) {
 if(game.phase!=='move' || !Number.isInteger(index)) throw Error('Chưa được di chuyển');
 const legal=legalMoves(game).find(x=>x.index===index);
 if(!legal) throw Error('Nước đi không hợp lệ');
 const tokens=Object.fromEntries(game.players.map(c=>[c,[...game.tokens[c]]]));
 tokens[legal.color][index]=legal.to;
 const captured=[];
 const occupied=trackIndex(legal.color,legal.to);
 if(occupied!==-1) {
  for(const other of game.players) {
   if(other===legal.color) continue;
   tokens[other].forEach((p,i)=>{
    if(trackIndex(other,p)===occupied) { tokens[other][i]=-1;captured.push({color:other,index:i}); }
   });
  }
 }
 const victory=tokens[legal.color].every(p=>p===END);
 const next={...game,tokens,phase:victory?'done':'roll',winner:victory?legal.color:null,
  turn:victory||game.die===6?game.turn:(game.turn+1)%game.players.length};
 next.message=victory
  ? `🏆 ${COLOR_NAMES[legal.color]} chiến thắng! Cả 4 ngựa đã về đích.`
  : `${COLOR_NAMES[legal.color]} đi ${game.die} bước${captured.length?', đá '+captured.length+' quân!':''}. ${game.die===6?'Được tung thêm lượt.':`Đến lượt ${COLOR_NAMES[activeColor(next)]}.`}`;
 const route=legal.from===-1?[coordinate(legal.color,0,index)]
  :Array.from({length:legal.to-legal.from},(_,i)=>coordinate(legal.color,legal.from+i+1,index));
 return {game:next,route,captured,finished:legal.to===END,victory};
}
export function rollFair() {
 if(globalThis.crypto?.getRandomValues) {
  const a=new Uint32Array(1); const bound=Math.floor(0x100000000/6)*6;
  do { globalThis.crypto.getRandomValues(a); } while(a[0]>=bound);
  return a[0]%6+1;
 }
 return Math.floor(Math.random()*6)+1;
}
