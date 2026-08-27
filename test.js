const assert=require('assert');const {MorrisGame,COORDS,MILLS,ADJ}=require('./script');
assert.equal(COORDS.length,24);assert.equal(MILLS.length,16);assert.equal(ADJ.length,24);ADJ.forEach((ns,i)=>ns.forEach(n=>assert(ADJ[n].includes(i))));
let g=new MorrisGame();[0,3,1,4,2].forEach(i=>assert(g.play(i)));assert(g.removing);assert.deepEqual(g.removable(),[3,4]);assert(!g.play(99));assert(g.play(3));assert.equal(g.count(2),1);assert.equal(g.turn,2);
g=new MorrisGame();g.stock=[0,0,0];g.board[0]=g.board[8]=g.board[10]=g.board[21]=1;g.board[3]=g.board[4]=g.board[5]=g.board[6]=2;g.turn=1;assert.deepEqual(g.targets(10),[9,11,18]);assert(g.play(10));assert(g.play(9));assert(g.removing);assert(g.play(6));assert.equal(g.turn,2);
g=new MorrisGame();g.stock=[0,0,0];g.board[0]=g.board[1]=g.board[2]=1;g.board[3]=g.board[4]=g.board[5]=2;g.turn=1;assert.equal(g.phase(),'FLY');assert(g.play(0));assert(g.targets(0).includes(23));assert(g.play(23));
g=new MorrisGame();g.stock=[0,0,0];g.board[0]=g.board[1]=g.board[2]=1;g.board[3]=g.board[4]=g.board[5]=2;g.turn=1;g.removing=true;assert(g.play(3));assert.equal(g.winner,1);
console.log('All game logic tests passed.');
