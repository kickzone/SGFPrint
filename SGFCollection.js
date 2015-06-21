/*zipファイルを読み込み、SGFの一覧を保持するモジュール*/
var SGFCollection = (function(){
	var zip;
	var onLoading = false;
	var fileList = [];

	return {
		isLoading: function(){return onLoading;},

		getCount: function(){return fileList.length;},

		getFile: function(idx){
			return zip.file(fileList[idx]).asText();
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
				onLoading = false;
			}
			// read the file !
			// readAsArrayBuffer and readAsBinaryString both produce valid content for JSZip.
			reader.readAsArrayBuffer(file);
		}
	};
})();