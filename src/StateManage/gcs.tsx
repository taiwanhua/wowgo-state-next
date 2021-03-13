import * as React from 'react';
import { BehaviorSubject } from 'rxjs';
import { isString } from 'lodash'

/**
 * @description 靜態數據流類
 * @example 
 * gcs gcs();
 */
export class gcs {

    GlobalContext: BehaviorSubject<{}>;

    constructor() {
        //#region 新建 BehaviorSubject
        this.GlobalContext = new BehaviorSubject({}); // {} is the initial value
        //console.log(GlobalContext)
        //#endregion
    }

    //#region 主要方法
    //#region 取得指定項目
    /**
     * @description 取得指定項目
     * @param {*} keys 想要取得的項目鍵名
     * @returns any - 對應鍵名的資料
     * @example 
     * gcs.get("firstKey", "SecondKey");
     */
    get(...keys: string[]) {
        const getChild = (object: any, childKeyName: string) => {
            return object[childKeyName];
        }
        let res = this.GlobalContext.getValue();
        for (let i = 0; i < keys.length; i++) {
            if (res) {
                res = getChild(res, keys[i])
            }
            else {
                return res;
            }
        }
        return res;
    }
    //#endregion

    //#region 設定、取代指定項目
    /**
    * @description 設定、取代指定項目
    * @param {*} keys 想要設定、取代的項目鍵名，最後一個參數為要設定的值
    * @returns  - 所有資料
    * @example 
    * gcs.set("firstKey", "SecondKey", { value : "myvalue" });
    * gcs.set("firstKey", "SecondKey", 123);
    */
    set(...keys: any[]) {

        interface GetData {
            [key: string]: any
        }

        let res = this.GlobalContext.getValue();
        let parmaLength = keys.length;
        let setValueIndex = keys.findIndex((parma) => (!isString(parma))); // all of parma is string return -1
        if (setValueIndex < (parmaLength - 1) && (setValueIndex !== -1)) {
            //若非剛好 value為最後一個參數，則不處理並返回整個 Context
            console.error("參數設置錯誤")
            return res;
        }
        else {
            let valueIndex = setValueIndex === -1 ? parmaLength - 1 : setValueIndex;
            // b , c ,value  <3
            for (let index = 0; index < keys.length - 1; index++) {
                if (this.get(...keys.slice(0, index + 1))) {
                    // 該key已存在
                    if (index === valueIndex - 1) {
                        // 若已經來到 最後一個 key
                        let data: GetData = this.get(...keys.slice(0, index));
                        data[`${keys[index]}`] = keys[valueIndex];
                        this.GlobalContext.next(res);
                    }
                    else {
                        continue;
                    }
                }
                else {
                    // 該key不存在
                    if (index === valueIndex - 1) {
                        // 若已經來到 最後一個 key
                        let data: GetData = this.get(...keys.slice(0, index)) ?? {};
                        data[`${keys[index]}`] = keys[valueIndex];
                        this.GlobalContext.next(res);
                    }
                    else {
                        // 還有下一層的key
                        let data: GetData = this.get(...keys.slice(0, index)) ?? {};
                        data[`${keys[index]}`] = {};
                        this.GlobalContext.next(res);
                    }
                }

            }

            return this.GlobalContext.getValue();
        }
    }
    //#endregion
    //#region 移除指定項目
    /**
    * @description 移除指定項目
    * @param {*} keys 想要移除項目鍵名
    * @returns - 所有資料
    * @example 
    * gcs.remove("firstKey", "SecondKey");
    */
    remove(...keys: any[]) {

        interface GetData {
            [key: string]: any
        }

        let res = this.GlobalContext.getValue();
        let parmaLength = keys.length;
        let setValueIndex = keys.findIndex((parma) => (!isString(parma))); // all of parma is string return -1
        if (setValueIndex !== -1) {
            //若非剛好 value為最後一個參數，則不處理並返回整個 Context
            console.error("參數設置錯誤")
            return res;
        }
        else {
            // b , c ,value  <3
            for (let index = 0; index < keys.length; index++) {
                if (this.get(...keys.slice(0, index + 1))) {
                    // 該key已存在
                    if (index === parmaLength - 1) {
                        // 若已經來到 最後一個 key
                        let data: GetData = this.get(...keys.slice(0, index));
                        delete data[`${keys[index]}`]
                        this.GlobalContext.next(res);
                    }
                    else {
                        continue;
                    }
                }
                else {
                    // 該key不存在 則不做任何更動，值接返回
                    return this.GlobalContext.getValue();
                }
            }

            return this.GlobalContext.getValue();
        }
    }
    //#endregion
    //#region 清除所有 Context，還原空物件
    /**
    * @description 清除所有 Context，還原空物件
    * @returns - 所有資料
    * @example 
    * gcs.clear();
    */
    clear(...keys: any[]) {
        this.GlobalContext.next({});
        return this.GlobalContext.getValue();
    }
    //#endregion
    //#endregion

}
