/*zipファイルを読み込み、SGFの一覧を保持するモジュール*/
var SGFCollection = (function(){
	var zip;
	var onLoading = false;
	var fileList = [];
	var sgfs = [];

	function createSGFElement(){
		for(var i=0; i<fileList.length; i++){
			//windowsだから？ファイル名がsjisエンコーディングのことがある。どうかしてる。
			//素晴らしいライブラリがあったのでこれを利用させてもらう
			//http://polygon-planet-log.blogspot.jp/2012/04/javascript.html
			var fileStr = fileList[i];
			var fileArr = Encoding.stringToCode(fileList[i]);
			if(Encoding.detect(fileArr, 'SJIS'))
			{
				var utf8Arr = Encoding.convert(fileArr, 'UNICODE', 'SJIS');
				fileStr = Encoding.codeToString(utf8Arr);
			}
			var elem = new SGFElement(fileStr, zip.file(fileList[i]).asText());
			sgfs.push(elem);
		}
	}

	return {
		isLoading: function(){return onLoading;},

		getCount: function(){return fileList.length;},

		getFile: function(idx){
			return zip.file(fileList[idx]).asText();
		},

		getFileName: function(idx){
			return fileList[idx];
		},

		//パッケージファイルを開く zipファイルは開きっぱなしにしておく
		openFile: function(file)
		{
			onLoading = true;
			//zipファイルをfilereaderで開く
			var reader = new FileReader();

			reader.onload = function(e) {
				zip = new JSZip(e.target.result);
				//sgfファイルだけ取り出して配列に加える
				for(f in zip.files){
					if(f.toUpperCase().indexOf(".SGF") != -1){
						fileList.push(f);
					}
				}
				createSGFElement();
				onLoading = false;

			}
			// read the file !
			// readAsArrayBuffer and readAsBinaryString both produce valid content for JSZip.
			reader.readAsArrayBuffer(file);
		},

		getSGFs: function(){
			return sgfs;
		}

	};
})();