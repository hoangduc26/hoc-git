export interface ISystemSetting {
    defaultColor?: 'GREEN' | 'PURPLE'; // default 'PURPLE'
    inputConfirmMessageFlg: boolean; // không thấy sử dụng ?
    settingWhenSelectVehicle: number; // label: 車輌選択時設定, value: 1 (前回利用の車輌を優先する), 2 ( 表示の都度車輌を指定する )
    settingProductType: number; // label: 品名選択方法, value: 0 (品名一覧選択), 1 (種類→品名選択)
    collectionResultInputSetting: { // label:回収実績入力設定
        prioritize: number; // label: 優先する, value: 1 (数量入力) , 2 (作業選択)
        dispatchType: number; // label: 回収状況, value: 0 (コースのみ), 1 (スポットのみ), 2 (すべて)
        convertedPackagingSetting: number; // label: スポット 換算数量/荷姿数量, value: 0 (換算数量),1 (荷姿数量)
    };
    commonPageSize: number, // label: 共通明細初期表示件数設定
    importRecordRegistrationSetting: number; // label: 搬入実績登録設定, value: 0 (回収現場毎に搬入する), 1 (回収品目毎に搬入する)
    workLineVoucherSetting: number; // label: 作業明細伝票設定, value: 1 (表示する（プリンタ出力）), 2 (表示する（PDF出力）), 3 (表示しない（印刷しない）)
    isPrintCopy: boolean; // 控え印刷
    screenDisplay: { // label : 画面表示自動更新設定（リロード）
        intervalAutoUpdate: number; // label: 更新間隔（秒） 
    };
    location: { // label: 位置情報の更新設定
        intervalAutoUpdate: number; // label: 更新間隔（秒）
    };

    searchDispatchStatusDefault: { // label: 配車状況 検索既定値設定
        settingSearch: number | null; // label: 検索条件/絞り込み/並び順の保持設定, value: 1 (前回の検索条件を優先する), 2 (表示都度設定する)
        dispatchType: number; // label: không có label, value: 1(スポットのみ), 2(コースのみ), 0 (全て)
        isSearchWorkDate: boolean | null;
        dateCompareType: number | null;
        workDateFrom: string;
        workDateTo: string;
        dispatchStatusIsReceived: boolean; // label: 受注, value: true/false.
        dispatchStatusIsDispatch: boolean; // label: 配車, value: true/false
        dispatchStatusIsRecorded: boolean; // label: 計上, value: true/false
        dispatchStatusIsCancel: boolean; // label : キャンセル, value: true/false
        dispatchStatusIsNoCollection: boolean; // label: 回収無し, value: true/false
        branchCd: number | null; // label: 拠 点
        branchName: string; // label: 拠 点
        salesPersonCd: number | null | any; // label: 営業者
        salesPersonName: string; // label: 営業者
        driverCd: number | null | any; // label: 運転者
        driverName: string; // label: 運転者
        vehicleTypeCd: number | null | any; // label: 車 種
        vehicleTypeName: string; // label: 車 種
        collectionPlaceType: number; // label: 回収場所, value: 0 (業者名), 1 (現場名), 2(住所)
        collectionPlace: string; // không thấy sử dụng ?
        sortOrder: number | null // label: 並び順, value: 0 (ASCENDING), 1 (DESCENDING)
    };
    productDefault: any[]; // label: 受入実績入力 品名既定値設定,  value: [] or [{ productCd:'', productName: '' }]
    timeStamp: string;
}