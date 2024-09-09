/* eslint-disable eqeqeq */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable camelcase */
const generateHtml = (dataPrint, signatureBase64?, isPrintCopy?) => `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        html {
            font-size: 27px;
            line-height: 32px;
            
        }

        h6 {
            font-size: 27px;
            line-height: 32px;
            margin: 0 !important;
            display: inline;
            font-weight: bold;
        }

        .d-flex {
            display: flex;
        }

        .d-none {
            display: none;
        }

        .d-block {
            display: block  !important;
        }

        .text-nowrap {
            white-space: nowrap;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .break-line {
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid black;
        }

        .title {
            font-size: 44px !important;
            margin-top: 0 !important;
        }

        .ml-3 {
            margin-left: 3px;
        }

        .footer {
            display:flex;
            justify-content: space-between;
        }
    </style>
</head>

<body>
    <div style="max-width: 350px;">
        <section>
            <div class="text-center">
                <h1 class="title">${isPrintCopy ? '作業明細（控）' : '作業明細'}</h1>
            </div>
            <div class="container">
                <div class="row">
                    <h6>作業日　:</h6>
                    <h6 class="ml-3">
                        ${dataPrint.createDate}
                    </h6>
                </div>
                <div class="row">
                    <h6>作業時刻:</h6>
                    <h6 class="ml-3">
                        ${dataPrint.operationTime}
                    </h6>
                </div>
                <div class="row">
                    <h6>担当者　:</h6>
                    <h6 class="ml-3">
                        ${dataPrint.driverName}
                    </h6>
                </div>
                <div class="row d-flex">
                    <h6 class="text-nowrap">得意先名:</h6>
                    <div class="ml-3">
                        <h6 class="d-block">
                            ${dataPrint.companyName1}
                        </h6>
                        <h6 class="d-block">
                            ${dataPrint.companyName2}
                        </h6>
                    </div>
                </div>
                <br>

                <div class="row d-flex">
                    <h6 class="text-nowrap">回収現場:</h6>
                    <div class="ml-3">
                        <h6 class="d-block">
                            ${dataPrint.siteName1}
                        </h6>
                        <h6 class="d-block">
                            ${dataPrint.siteName2}
                        </h6>
                    </div>
                </div>
            </div>

            <br>
            <div class="text-center">
                <h6>
                    【明細】
                </h6>
            </div>
            ${dataPrint.collectionDetails.map(e => {
    const isQuantityUnitValid = e.quantity && e.unitName;
    const isConvertQuantityUnitValid = e.convertedQuantity && e.convertedUnitName;
    let itemHtml = '';
    if (isQuantityUnitValid || isConvertQuantityUnitValid) {
        itemHtml += `<div>${e.productName}</div>`;
    }
    if (isQuantityUnitValid) {
        itemHtml += ` <div class="text-right">
                    ${e.quantity + e.unitName}
                </div>`;
    }
    if (isConvertQuantityUnitValid) {
        itemHtml += ` <div class="text-right">
                ${e.convertedQuantity + e.convertedUnitName}
                </div>`;
    }
    return itemHtml;
},
).join('')
    }
        </section>

        <div class="break-line"></div>
        <section>
            <div class="text-center">
                <h6>
                    【問合せ】
                </h6>
            </div>
            <div class="row d-flex">
                <h6 class="text-nowrap">会社名:</h6>
                <div class="ml-3">
                    <h6 class="d-block">
                        ${dataPrint.companyName1}
                    </h6>
                    <h6 class="d-block">
                        ${dataPrint.companyName2}
                    </h6>
                </div>
            </div>
            <div class="row d-flex">
                <h6 class="text-nowrap">住所　:</h6>
                <div class="ml-3">
                    <h6 class="d-block">
                        〒${dataPrint.carrierPostalCode}
                    </h6>
                    <h6 class="d-block">
                        ${dataPrint.carrierAddress1}
                    </h6>
                    <h6 class="d-block">
                        ${dataPrint.carrierAddress2}
                    </h6>
                </div>
            </div>
            <div class="row">
                <h6>電話　:</h6>
                <h6 class="ml-3">
                    ${dataPrint.carrierTel}
                </h6>
            </div>
            <div class="row">
                <h6>サイン欄</h6>
            </div>
            <div class="footer">
            <div>
                <img class="${signatureBase64 ? '' : 'd-none'}" height="150"  src="${signatureBase64}" />
            </div>
            <div class="text-right">
                <canvas id="myCanvas"></canvas>
            </div>
        </div>
        </section>
        <div class="break-line"></div>
    </div>

    <script>
        const canvas = document.getElementById("myCanvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");
        // 新しいパスを開始する。
        ctx.beginPath();
        // 指定されたポイントにパスを移動する。
        ctx.moveTo(0, 0);
        // 指定のポイントへ線を作成する。
        ctx.lineTo(0, 100);
        ctx.lineTo(100, 100);
        ctx.lineTo(100, 0);
        ctx.lineTo(0, 0);
        // 線の幅を指定する。
        ctx.lineWidth = 2;
        // 線を描画する。
        ctx.stroke();
    </script>
</body>

</html>
    `;

export default function sendMessagePrintCollection(dataPrint, signatureBase64?, isPrintCopy?) {
    const u = navigator.userAgent;
    // const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // android端末
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios端末

    let isChrome = false;
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('chrome') != -1) {
        isChrome = true;
    } else if (userAgent.indexOf('crios') != -1) {
        isChrome = true;
    }
    let passprntUri = 'starpassprnt://v1/print/nopreview?size=2';
    if (isChrome) {
        passprntUri += '&back=googlechrome://';
    } else {
        passprntUri += '&back=none';
    }

    const htmlPassPRNT = generateHtml(dataPrint, signatureBase64, isPrintCopy);

    passprntUri = `${passprntUri}&html=${encodeURIComponent(htmlPassPRNT)}`;
    window.location.href = passprntUri;
}
