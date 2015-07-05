//div1単位
//碁盤とコメントの1セットを表す
var Box = function(element, eIndex, $allBox){
	//ボックス要素を作成 divの中に碁盤とコメントを配置
	var $newBox = $("<div/>");
	$newBox.addClass("box");
	//タイトル
	var $name = $("<p/>");
	$name.addClass("name");
	var nameText = element.fileName.split(".")[0];
	if(eIndex == -1){
		nameText += " 問題";
	}else{
		var no = eIndex+1;
		nameText += " " + no.toString() + "図";
	}
	$name.text(nameText)
	$newBox.append($name);

	//碁盤描画
	var $canvas = $("<canvas/>");
	$canvas.addClass("goban");
	this.goban = new Goban($canvas[0], element);
	this.goban.drawGoban();
	this.goban.drawStones(eIndex);
	$newBox.append($canvas);

	//コメント作成
	this.comment = element.getComment(eIndex);
	var comments = this.comment.split("\n");
	for(var i=0; i<comments.length; i++){
		if(comments[i] == "") continue;
		var $comment = $("<p/>");
		$comment.addClass("comment");
		$comment.text(comments[i]);
		$newBox.append($comment);
	}

	//subBoxがない or subBoxにboxが6つあれば、新規subBoxを追加
	var needNewSubBox = false;
	var $subBox;
	if($allBox.children().length == 0) needNewSubBox = true;
	else{
		$subBox = $allBox.children().last();
		if($subBox.children().length == 6) needNewSubBox = true;
	}

	if(needNewSubBox){
		$subBox = $("<div/>");
		$subBox.addClass("subBox");
		$allBox.append($subBox);
	}

	//subBoxに追加
	$subBox.append($newBox);
	//6つ目にはclearfixをつける
	if($subBox.children().length == 6) $newBox.addClass("clearfix");

	this.box = $newBox[0];
}