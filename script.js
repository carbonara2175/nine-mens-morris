const COORDS=[[70,70],[350,70],[630,70],[165,165],[350,165],[535,165],[260,260],[350,260],[440,260],[70,350],[165,350],[260,350],[440,350],[535,350],[630,350],[260,440],[350,440],[440,440],[165,535],[350,535],[535,535],[70,630],[350,630],[630,630]];
const MILLS=[[0,1,2],[3,4,5],[6,7,8],[9,10,11],[12,13,14],[15,16,17],[18,19,20],[21,22,23],[0,9,21],[3,10,18],[6,11,15],[1,4,7],[16,19,22],[8,12,17],[5,13,20],[2,14,23]];
const ADJ=[[1,9],[0,2,4],[1,14],[4,10],[1,3,5,7],[4,13],[7,11],[4,6,8],[7,12],[0,10,21],[3,9,11,18],[6,10,15],[8,13,17],[5,12,14,20],[2,13,23],[11,16],[15,17,19],[12,16],[10,19],[16,18,20,22],[13,19],[9,22],[19,21,23],[14,22]];

class MorrisGame{
  constructor(){this.reset()}
  reset(){this.board=Array(24).fill(0);this.stock=[0,9,9];this.turn=1;this.selected=null;this.removing=false;this.winner=0}
  count(p){return this.board.filter(x=>x===p).length}
  isMillAt(i,p){return MILLS.some(m=>m.includes(i)&&m.every(n=>this.board[n]===p))}
  removable(){const enemy=3-this.turn,all=this.board.map((p,i)=>p===enemy?i:-1).filter(i=>i>=0),outside=all.filter(i=>!this.isMillAt(i,enemy));return outside.length?outside:all}
  phase(p=this.turn){if(this.stock[1]+this.stock[2]>0)return'PLACE';return this.count(p)===3?'FLY':'MOVE'}
  targets(i){if(this.board[i]!==this.turn||this.stock[1]+this.stock[2]>0)return[];const candidates=this.count(this.turn)===3?this.board.map((_,n)=>n):ADJ[i];return candidates.filter(n=>this.board[n]===0)}
  canMove(p){if(this.count(p)===3)return this.board.includes(0);return this.board.some((v,i)=>v===p&&ADJ[i].some(n=>this.board[n]===0))}
  finishTurn(){const enemy=3-this.turn;if(this.stock[1]+this.stock[2]===0&&(this.count(enemy)<=2||!this.canMove(enemy))){this.winner=this.turn;return}this.turn=enemy;this.selected=null}
  play(i){
    if(this.winner)return false;
    if(this.removing){if(!this.removable().includes(i))return false;this.board[i]=0;this.removing=false;this.finishTurn();return true}
    if(this.stock[1]+this.stock[2]>0){if(this.board[i])return false;this.board[i]=this.turn;this.stock[this.turn]--;if(this.isMillAt(i,this.turn)&&this.count(3-this.turn)>0)this.removing=true;else this.finishTurn();return true}
    if(this.board[i]===this.turn){this.selected=i;return true}
    if(this.selected!==null&&this.targets(this.selected).includes(i)){const from=this.selected;this.board[from]=0;this.board[i]=this.turn;this.selected=null;if(this.isMillAt(i,this.turn))this.removing=true;else this.finishTurn();return true}
    return false
  }
}

if(typeof module!=='undefined')module.exports={MorrisGame,COORDS,MILLS,ADJ};
if(typeof document!=='undefined'){
  const game=new MorrisGame(),points=document.querySelector('#points');
  COORDS.forEach(([x,y],i)=>{const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.classList.add('point');g.dataset.id=i;g.setAttribute('tabindex','0');g.setAttribute('role','button');g.innerHTML=`<circle class="hit" cx="${x}" cy="${y}" r="34"/><circle class="node" cx="${x}" cy="${y}" r="13"/>`;g.addEventListener('click',()=>{game.play(i);render()});g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();game.play(i);render()}});points.append(g)});
  const $=id=>document.getElementById(id);
  function render(){
    const targets=game.selected===null?[]:game.targets(game.selected),removable=game.removing?game.removable():[];
    [...points.children].forEach((el,i)=>{el.className.baseVal=`point ${game.board[i]?`p${game.board[i]}`:''} ${i===game.selected?'selected':''} ${targets.includes(i)?'target':''} ${removable.includes(i)?'removable':''}`;el.setAttribute('aria-label',`地点 ${i+1}${game.board[i]?` Player ${game.board[i]} の石`:''}`)});
    [1,2].forEach(p=>{$(`p${p}-board`).textContent=game.count(p);$(`p${p}-stock`).textContent=game.stock[p];$(`player-${p}-card`).classList.toggle('active',game.turn===p&&!game.winner)});
    $('phase').textContent=game.phase();$('turn').textContent=`P${game.turn} TURN`;
    let label=`PLAYER ${game.turn}`,text='動かす石を選んでください';
    if(game.removing){label='MILL!';text='相手の石を1個取ってください'}else if(game.phase()==='PLACE')text='石を配置してください';else if(game.selected!==null)text='移動先を選んでください';else if(game.phase()==='FLY')text='FLY：動かす石を選んでください';
    $('instruction-label').textContent=label;$('instruction').textContent=text;
    $('winner').hidden=!game.winner;if(game.winner)$('winner').querySelector('strong').textContent=`PLAYER ${game.winner} WIN!`;
  }
  function reset(){if(game.count(1)+game.count(2)===0||confirm('ゲームを最初からやり直しますか？')){game.reset();render()}}
  $('reset').addEventListener('click',reset);$('winner-reset').addEventListener('click',()=>{game.reset();render()});render();
}
