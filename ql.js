console.log('JavaScriptでQlearningやってみる\n');
console.log('2つの分かれ道がある');

const NODE_NO = 15; //Q値のノード数
const GEN_MAX = 1000; //学習回数
const ALPHA = 0.1; //学習係数
const GAMMA = 0.9; //割引率
const EPSILON = 0.3; //行動選択のランダム聖を決定(閾値)
const REWORD_1 = 1000; //報酬1
const REWORD_2 = 5000; //報酬2
const DEPTH = 3; //道のりの深さ

log = ""; //経路選択のログを保存する
console.log('道のりの深さは: ' + DEPTH);
console.log('最終的なゴール数は: ' + Math.pow(2, DEPTH) + '\n');

main();

function main() {
 let q_val = [NODE_NO]; //Q値
 let status; //状態

 //Q値のノード数の数だけループ
 for (let i = 0; i < NODE_NO; i++) {
  // 0~100の乱数を発生させて
  // q_valに代入
  q_val[i] = parseInt(getRandByMinMax(0, 100));
 }
 console.log('\n【初期値のQ値】\n' + q_val + '\n');


 //学習本体 学習回数だけループ
 for (let i = 0; i < GEN_MAX; i++) {

  status = 0; //状態を初期化

  //道のりの深さ分だけループ
  for (let t = 0; t < DEPTH; t++) {

   //console.log('\n【現在のQ値】\n' + q_val + '\n');
   status = selecta(status, q_val);
   //console.log('経路が選択されました: ' + status);
   log += status + '\t';
   q_val[status] = upDateQ(status, q_val);
   //console.log('　―その経路のQ値: ' + q_val[status]);


   //結果をわかり易く表示(show_num回に１回結果を表示
   let show_num = 10;
   if(i%show_num == 0) {
    let result = '';
    for (let j = 1; j < NODE_NO; j++) {
     result += 's'+j+': '+ q_val[j] + '\t';
     //result += q_val[j] + '\t';
    }
    console.log(result);
   }


  }

 }
 // saveLog();


 console.log('\nlog:\n' + log);
 saveLog();
}

//Q値を更新する関数
//引数1 現在の状態(status)
//引数2 Q値(q_val)
//戻り値
function upDateQ(old_status, q_val) {
 let q_v; //更新されるQ値
 let q_max; //Q値の最大値

 //現在の状態が6より大きかったら
 if (old_status > 6) {
  if (old_status == 14) {
   //現在の状態が14なら報酬を付与
   q_v = q_val[old_status] + ALPHA * (REWORD_1 - q_val[old_status]);
  } else if (old_status == 11) {
   //現在の状態が11なら報酬を付与
   q_v = q_val[old_status] + ALPHA * (REWORD_2 - q_val[old_status]);
  }
 } else {
  if (q_val[2 * old_status + 1] > q_val[2 * old_status + 2]) {
   q_max = q_val[2 * old_status + 1];
  } else {
   q_max = q_val[2 * old_status + 2];

  }

  q_v = (q_val[old_status] + ALPHA * (GAMMA * q_max - q_val[old_status]));
 }
 return parseInt(q_v);
}


//行動を選択する関数
//引数1 現在の状態(status)
//引数2 Q値(q_val)
//戻り値 新しく決定した状態(status)
function selecta(old_status, q_val) {
 let status;

 //発生した乱数(0.00~1.00)が閾値より小さかったら
 if (getRandByMinMax(0, 1) < EPSILON) {

  //★★道は2通りしかないので、どちらかをランダムで決定する
  if (get01() == 0) {
   //0か1を発生させて、0だったら
   //現在の状態を2倍して、+1する
   status = 2 * old_status + 1;
  } else {
   //0か1を発生させて、1だったら
   //現在の状態を2倍して、+2する
   status = 2 * old_status + 2;
  }

 } else {
  //発生した乱数(0.00~1.00)が閾値より大きかったら

  //２つのQ値を比較する
  if (q_val[2 * old_status + 1] > q_val[2 * old_status + 2]) {
   //現在の状態を2倍して、+1する
   status = 2 * old_status + 1;
  } else {
   //現在の状態を2倍して、+2する
   status = 2 * old_status + 2;
  }
 }

 return parseInt(status);
}


//引数1 発生させたい乱数の最小値
//引数1 発生させたい乱数の最大値
//戻り値 最小値〜最大値の間の数字
function getRandByMinMax(min, max) {
 return (Math.random() * (max - min) + min);
}

//戻り値 0か1のどちらかの整数
function get01() {
 return Math.floor(Math.random() * 2);
}


function saveLog() {
 var fs = require('fs');
 try {
  fs.writeFileSync('log.txt', log);
 } catch (e) {
  console.log('e: ' + e);
 }

}
