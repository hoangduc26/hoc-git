// StarWebPrintExec
function printExec(dataList) {
	var ref = document.referrer;
	
    var builder = new StarWebPrintBuilder();
    var request = '';

    // エレメントを初期化する。
    request += builder.createInitializationElement();

    // リストを取得する。
    var printDataList = dataList;
    if (printDataList.length != 0) {
        // 前後の括弧を削除する。
        printDataList = printDataList.replace("[", "");
        printDataList = printDataList.replace("]", "");
        // 改行で切り出す。
        printDataList = printDataList.split('\n');
        
        // リクエストに格納する。
        for (var i = 0; i < printDataList.length; i++) {
        	if (i != 0) {
        		if (printDataList[i].indexOf('endTrim') != -1) {
            		printDataList[i] = printDataList[i].replace("endTrim", "");
            		// 末尾の空白のみ削除する
            		printDataList[i] = printDataList[i].slice(0, -1);
            	}
            	else
            	{
            		// 前後の空白を取り除く
                	printDataList[i] = printDataList[i].trim();
            	}
        	}
        	
        	// 題名
        	// ポジション：中央揃え、幅と高さ：2倍
        	if (i == 0) {
        		request += builder.createAlignmentElement({position:'center'});
        		request += builder.createTextElement({width:2, height:2, data:printDataList[i]});
        	}
        	// 小見出し
        	// ポジション：中央揃え、幅と高さ：等倍
        	else if (printDataList[i].indexOf('komidashi') != -1) {
        		// 識別子は削除する。
        		printDataList[i] = printDataList[i].replace("komidashi", "");
        		// 【問合せ】の場合、直前に仕切り線を追加する。
        		if (printDataList[i].indexOf('【問') != -1) {
        			// 罫線
                    // 線種：中線、長さ：600
                    request += builder.createAlignmentElement({position:'left'});
                    request += builder.createRuledLineElement({thickness:'medium', width:600});
        		}
        		request += builder.createAlignmentElement({position:'center'});
        		request += builder.createTextElement({width:1, height:1, data:printDataList[i]});
        	}
        	// 数量
        	// ポジション：右揃え、幅と高さ：等倍
        	else if (printDataList[i].indexOf('suryo') != -1) {
        		printDataList[i] = printDataList[i].replace("suryo", "");
        		request += builder.createAlignmentElement({position:'right'});
        		request += builder.createTextElement({width:1, height:1, data:printDataList[i]});
        	} 
        	// その他のデータ
        	// ポジション：左揃え、幅と高さ：等倍
        	else {
        		request += builder.createAlignmentElement({position:'left'});
        		request += builder.createTextElement({characterspace:0, width:1, height:1, data:printDataList[i]});
        	}
        	// 改行
        	// ポジション：左揃え、幅と高さ：等倍
        	request += builder.createTextElement({width:1, height:1, data:'\n'});
        }
        
        // サイン欄に押印枠の「□」を作成する。
    	// Canvasの中身を設定する。
    	var eleId = document.getElementById("myCanvas");
    	var ctx = eleId.getContext("2d");
    		// 新しいパスを開始する。
    		ctx.beginPath();
    		// 指定されたポイントにパスを移動する。
    		ctx.moveTo(0,0);
    		// 指定のポイントへ線を作成する。
    		ctx.lineTo(0,100);
    		ctx.lineTo(100,100);
    		ctx.lineTo(100,0);
    		ctx.lineTo(0,0);
    		// 線の幅を指定する。
    		ctx.lineWidth = 2;
    		// 線を描画する。
    		ctx.stroke();
    	// 右寄せにする。
    	request += builder.createAlignmentElement({position:'right'});
    	// 設定したCanvasからビットイメージを生成する。
    	request += builder.createBitImageElement({context:ctx, x:0, y:0, width:100, height:100});
        
        // 罫線
        // 線種：中線、長さ：600
        request += builder.createAlignmentElement({position:'left'});
        request += builder.createRuledLineElement({thickness:'medium', width:600});

        // 用紙カットエレメントを生成する。
        // true：カット前の用紙送りあり。false：カット前の用紙送りなし。
        request += builder.createCutPaperElement({feed:true});

        // メッセージを送信する。
        sendMessage(request);
    }
}

function sendMessage(request) {
	var url              = "http://localhost:8001/StarWebPRNT/SendMessage";
    var papertype        = null;

    var trader = new StarWebPrintTrader({url:url, papertype:papertype});

    // モバイルプリンタからの応答をもとに、プリンタの状態をチェックする。
    trader.onReceive = function (response) {
        var traderSuccessMsg = "";
    	var msg = "";
        var traderSuccessFlg = false;
        var statusFlg = false;
        
        // プリンターとの通信状態を確認する。
        if (response.traderSuccess == "false")
        {
        	traderSuccessMsg += 'プリンタの電源が入っていないか、ポートへの接続ができない可能性があります。設定を見直してください。';
        	traderSuccessFlg = true;
        }
        // カバーが開いているか確認する。
        if (trader.isCoverOpen            ({traderStatus:response.traderStatus}))
        {
        	msg += 'モバイルプリンターのカバーが開いています。';
        	statusFlg = true;
        }
        // プリンタがオフラインか確認する。
        if (trader.isOffLine              ({traderStatus:response.traderStatus}))
        {
        	msg += 'モバイルプリンターがオフラインです。';
        	statusFlg = true;
        }
        // コンパルジョンスイッチが閉じているか確認する。
        if (trader.isCompulsionSwitchClose({traderStatus:response.traderStatus}))
        {
        	msg += 'コンパルジョンスイッチが閉じています。';
        	statusFlg = true;
        }
        // 印刷ヘッド高温停止中か確認する。
        if (trader.isHighTemperatureStop  ({traderStatus:response.traderStatus}))
        {
        	msg += '印刷ヘッドが高温のため停止しています。';
        	statusFlg = true;
        }
        // 復帰不可能エラーか確認する。
        if (trader.isNonRecoverableError  ({traderStatus:response.traderStatus}))
        {
        	msg += '復帰不可能のエラーを検出しました。';
        	statusFlg = true;
        }
        // 用紙カッターエラーか確認する。
        if (trader.isAutoCutterError      ({traderStatus:response.traderStatus}))
        {
        	msg += '用紙カッターのエラーを検出しました。';
        	statusFlg = true;
        }
        // ブラックマークエラーか確認する。
        if (trader.isBlackMarkError       ({traderStatus:response.traderStatus}))
        {
        	msg += 'ブラックマークのエラーを検出しました。';
        	statusFlg = true;
        }
        // 用紙エンドか確認する。
        if (trader.isPaperEnd             ({traderStatus:response.traderStatus}))
        {
        	msg += '印刷用紙切れです。';
        	statusFlg = true;
        }
        // 用紙ニアエンドか確認する。
        if (trader.isPaperNearEnd         ({traderStatus:response.traderStatus}))
        {
        	msg += '印刷用紙切れが間近です。';
        	statusFlg = true;
        }

        // モバイルプリンターとの通信に異常があった場合、通信異常のメッセージのみ表示する。
        if (traderSuccessFlg == true && statusFlg == false)
        {
        	alertPopup('print', traderSuccessMsg);
        }
        // 通信はできているが、モバイルプリンターの状態に異常があった場合、状態異常のメッセージを表示する。
        else if (statusFlg == true)
        {
        	alertPopup('print', msg);
        }
        
        // ローディング画面を終了する。
        $('#loader-bg').delay(900).fadeOut(800);
        $('#loader').delay(600).fadeOut(300);
        $('#wrap').css('display', 'block');
    }

    // エラーのレスポンスがあった場合、設定を見直す旨のメッセージを表示する。
    trader.onError = function (response) {
        var msg = "プリンタの電源が入っていないか、ポートへの接続ができない可能性があります。設定を見直してください。";
        msg += response.responseText;

        // アラートを表示する。
        alertPopup('print', msg);
        
        // ローディング画面を終了する。
        $('#loader-bg').delay(900).fadeOut(800);
        $('#loader').delay(600).fadeOut(300);
        $('#wrap').css('display', 'block');
    }

    // 送信
    trader.sendMessage({request:request});
}