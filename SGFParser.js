var SGFParser = (function(){

	var parseItemSub = {};
	//黒置き石
	parseItemSub['AB'] = function(str, item){
		item.okiishi.push(new SGFStone(BLACK, str));
	}
	//白置き石
	parseItemSub['AW'] = function(str, item){
		item.okiishi.push(new SGFStone(WHITE, str));
	}
	//コメント
	parseItemSub['C'] = function(str, item){
		item.comment = str;
	}
	//黒着手
	parseItemSub['B'] = function(str, item){
		item.stone = new SGFStone(BLACK, str);
	}
	//白着手
	parseItemSub['W'] = function(str, item){
		item.stone = new SGFStone(WHITE, str);
	}


	return {
		//SGFファイル全体のパース
		parse: function(content, element){
			//改行は邪魔なので全部取っ払う
			content = content.replace(/[\n\r]/g,"");

			var nodeStack = []; //スタック
			var prevNode = null;
			var startIdx = -1;
			//ノードに分割
			for(var i=0; i<content.length; i++){
				if(content[i] == "("){
					//ノード開始
					//いま見ているノードをpushして次のノードを作成
					if(startIdx != -1){
						var node = new SGFNode(content.slice(startIdx, i));
						if(nodeStack.length == 0){
							//ルートノードを設定
							element.root = node;
						} else {
							//最後のノードの子ノードとしてpush
							nodeStack[nodeStack.length-1].childNodes.push(node);
						}
						nodeStack.push(node);
					}
					//ノードの文字列開始
					startIdx = i + 1;
				}else if(content[i] == ")"){
					//ノード終了
					//いま見ているノードがあれば新規作成
					if(startIdx != -1){
						var node = new SGFNode(content.slice(startIdx, i));
						if(nodeStack.length == 0){
							//ルートノードを設定
							element.root = node;
						} else {
							//最後のノードの子ノードとしてpush
							nodeStack[nodeStack.length-1].childNodes.push(node);
						}
					} else {
						//見ているノードがない、すなわち終了カッコが連続した場合は、スタックを1つpop
						nodeStack.pop();
					}
					startIdx = -1;
				}
			}
		},

		//ノードのパース
		parseNode: function(text, node){
			//アイテムに分割
			var startIdx = -1;
			for(var i=0; i<text.length; i++){
				if(text[i] == ";"){
					if(startIdx != -1){
						var item = new SGFItem(text.slice(startIdx+1, i));
						node.items.push(item);
					}
					startIdx = i;
				}
			}
			if(startIdx != -1){
				var item = new SGFItem(text.slice(startIdx+1));
				node.items.push(item);
			}
		},

		//アイテムのパース
		parseItem: function(text, item){
			var id = "";
			var str = "";
			var startKakko = -1;
			var startId = -1;
			for(var i=0; i<text.length; i++){
				if(text[i] == "["){
					startKakko = i;
					if(startId != -1){
						id = text.slice(startId, i);
					}
					startId = -1;
				}else if(text[i] == "]"){
					str = text.slice(startKakko+1, i);
					startKakko = -1;
					//parseItemSubに処理があればそれを実行
					if(id in parseItemSub){
						parseItemSub[id](str, item);
					}
				}
				else{
					if(startKakko == -1 && startId == -1){
						startId = i;
					}
				}
			}
		}
	}
})();
