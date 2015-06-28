const BLACK = 0;
const WHITE = 1;

//SGFファイル1つ分
var SGFElement = function(content){
	this.root = {};

	SGFParser.parse(content, this);

	this.branches = this.getAllBranch();
}

SGFElement.prototype = {
	//全てのノード組み合わせ（＝すべての分岐）をゲット
	getAllBranch: function(){
		var retArr = [];
		var nodeStack = [];
		var terminals = [];
		nodeStack.push(this.root);
		while(nodeStack.length){
			var currentNode = nodeStack[nodeStack.length-1];
			//子ノードがなければ終端とみなし、nodeStackの内容をretArrにコピー
			if(currentNode.childNodes.length == 0){
				terminals.push(currentNode);
				retArr.push([].concat(nodeStack)); //配列をシャローコピーするちょっと変わった書き方
				nodeStack.pop();
			}
			else{
				//terminalsに入っていない子ノードをスタックに入れる
				//一つもなければ、探索が終了したものとして終端一覧に入れ、自分自身をpop
				var findChild = false;
				for(i in currentNode.childNodes){
					var node = currentNode.childNodes[i];
					if(terminals.indexOf(node) == -1){
						findChild = true;
						nodeStack.push(node);
						break;
					}
				}
				if(!findChild){
					terminals.push(currentNode);
					nodeStack.pop();
				}
			}
		}
		return retArr;
	},
	//全ノードに対して何か処理をする
	processAllNodes: function(func){
		this.process(this.root, func);
	},
	//再帰用
	process: function(node, func){
		func(node);
		for(var i in node.childNodes){
			this.process(node.childNodes[i], func);
		}
	},
	//必要な碁盤のサイズを得る
	getGobanArea : function(){
		var retObj = {xmin:19, xmax:1, ymin:19, ymax:1};
		this.processAllNodes(function(node){
			for(var i in node.items){
				var item = node.items[i];
				var aIshi = [];
				if(item.stone) aIshi.push(item.stone);
				if(item.okiishi) Array.prototype.push.apply(aIshi, item.okiishi);
				for(var j in aIshi){
					var ishi = aIshi[j];
					if(ishi.x < retObj.xmin) retObj.xmin = ishi.x;
					if(ishi.x > retObj.xmax) retObj.xmax = ishi.x;
					if(ishi.y < retObj.ymin) retObj.ymin = ishi.y;
					if(ishi.y > retObj.ymax) retObj.ymax = ishi.y;
				}
			}
		});
		return retObj;

	}
}

//ノード1つ分
var SGFNode = function(text){
	this.childNodes = [];
	this.items = [];

	SGFParser.parseNode(text, this);
}

SGFNode.prototype = {

}

//アイテム1つ分(;で始まる単位)
var SGFItem = function(text){
	this.comment = "";
	this.stone = null;
	this.okiishi = [];

	SGFParser.parseItem(text, this);
}

//石1つを表す
var SGFStone = function(in_bw, XY){
	this.bw = in_bw;
	this.x = XY.charCodeAt(0) - 96;
	this.y = XY.charCodeAt(1) - 96;
}