var Goban = function(canvas, element){
	this.canvas = canvas;
	this.element = element;
	this.stage = new createjs.Stage(canvas);

	//定数
	this.GRID_SIZE = 30;
	this.PADDING = 15;

	this.areaPlus = {};

	this.vertLines = [];
	this.horiLines = [];
	this.wStones = [];
	this.wNumbers = [];
	this.bStones = [];
	this.bNumbers = [];
}

Goban.prototype = {
	drawGoban : function(){
		//範囲を2広げる
		var area = this.element.getGobanArea();
		area.xmin = Math.max(area.xmin-2, 1);
		area.xmax = Math.min(area.xmax+2, 19);
		area.ymin = Math.max(area.ymin-2, 1);
		area.ymax = Math.min(area.ymax+2, 19);
		this.areaPlus = area;

		this.canvas.width = this.PADDING*2 + (area.xmax - area.xmin)*this.GRID_SIZE;
		this.canvas.height = this.PADDING*2 + (area.ymax - area.ymin)*this.GRID_SIZE;

		//描画
		//縦線
		for(var x = area.xmin; x<=area.xmax; x++){
			//端の線は引かない
			if(x == area.xmin && x != 1) continue;
			if(x == area.xmax && x != 19) continue;
			var xpos = this.PADDING + (x - area.xmin) * this.GRID_SIZE;
			var ylen = (area.ymax - area.ymin) * this.GRID_SIZE;
			var ymin = this.PADDING;
			var ymax = ymin + ylen;

			var gr = new createjs.Graphics();
			var weight = 1;
			if(x == 1 || x == 19) weight = 3;
			gr.setStrokeStyle(weight).beginStroke("#000000").moveTo(xpos, ymin).lineTo(xpos, ymax).closePath();
			var sha = new createjs.Shape(gr);
			this.stage.addChild(sha);
			this.vertLines.push(sha);
		}
		//横線
		for(var y = area.ymin; y<=area.ymax; y++){
			//端の線は引かない
			if(y == area.ymin && y != 1) continue;
			if(y == area.ymax && y != 19) continue;
			var ypos = this.PADDING + (y - area.ymin) * this.GRID_SIZE;
			var xlen = (area.xmax - area.xmin) * this.GRID_SIZE;
			var xmin = this.PADDING;
			var xmax = xmin + xlen;

			var gr = new createjs.Graphics();
			var weight = 1;
			if(y == 1 || y == 19) weight = 3;
			gr.setStrokeStyle(weight).beginStroke("#000000").moveTo(xmin, ypos).lineTo(xmax, ypos).closePath();
			var sha = new createjs.Shape(gr);
			this.stage.addChild(sha);
			this.horiLines.push(sha);
		}
		this.stage.update();

	},
	drawStones: function(branchNo){
		//まず初期状態の石を置く
		var root = this.element.root;
		var okiishi = root.items[0].okiishi;
		for(var i in okiishi){
			var ishi = okiishi[i];
			this.drawAStone(ishi);
		}
		//次に数字付きで石を置いていく
		if(branchNo >= 0 && this.element.branches.length > branchNo){
			var branch = this.element.branches[branchNo];
			var count = 1;
			for(var i=1; i<branch.length; i++){
				var node = branch[i];
				for(var j in node.items){
					this.drawAStone(node.items[j].stone);
					this.drawNumber(node.items[j].stone, count);
					count++;
				}
			}
		}
		this.stage.update();
	},
	drawAStone: function(ishi){
		var area = this.areaPlus;
		var xpos = this.PADDING + (ishi.x - area.xmin) * this.GRID_SIZE;
		var ypos = this.PADDING + (ishi.y - area.ymin) * this.GRID_SIZE;
		var sha = new createjs.Shape();
		var gr = sha.graphics;
		gr.beginStroke("#000000");
		if(ishi.bw == BLACK){
			gr.beginFill("#000000");
			this.bStones.push(sha);
		}else{
			gr.beginFill("#FFFFFF");
			this.wStones.push(sha);
		}
		gr.drawCircle(xpos, ypos ,this.GRID_SIZE/2-2);
		this.stage.addChild(sha);
	},
	drawNumber: function(ishi, count){
		var area = this.areaPlus;
		var xpos = this.PADDING + (ishi.x - area.xmin) * this.GRID_SIZE - 4;
		if(count >= 10) xpos -= 2;
		var ypos = this.PADDING + (ishi.y - area.ymin) * this.GRID_SIZE - 8;
		var sha;
		var textSize = 18;
		if(ishi.bw == BLACK){
			sha = new createjs.Text(count.toString(), "bold " + textSize.toString(10) + "px ＭＳ ゴシック", "#FFFFFF");
			this.bNumbers.push(sha);
		}else{
			sha = new createjs.Text(count.toString(), "bold " + textSize.toString(10) + "px ＭＳ ゴシック", "#000000");
			this.wNumbers.push(sha);
		}
		sha.x = xpos;
		sha.y = ypos;
		this.stage.addChild(sha);
	}
}