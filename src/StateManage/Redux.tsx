import * as React from 'react'

import {
    Provider,
    createStoreHook,
    createDispatchHook,
    createSelectorHook,
    ReactReduxContextValue
} from 'react-redux'
import { AnyAction, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

const Context = React.createContext({} as ReactReduxContextValue<any, AnyAction>)

// Export your custom hooks if you wish to use them in other files.
/**
 * WowgoStore hook
 */
export const useWowgoStore = createStoreHook(Context)

/**
 * WowgoDispatch hook
 */
export const useWowgoDispatch = createDispatchHook(Context)

/**
 * WowgoSelector hook
 */
export const useWowgoSelector = createSelectorHook(Context)

// export function reducer(state = {}, action: any) {

//     // console.logloglog(state, action)
//     switch (action.type) {
//         case "INCREMENT1":
//             return {
//                 ...state,
//                 // todo1: state.todo1 + action.step
//             };
//         case "DECREMENT1":
//             return {
//                 ...state,
//                 // todo1: state.todo1 - action.step
//             };
//         default:
//             return state;
//     }
// }

/**
 * 創建 WowgoStore，用以傳入 WowgoProvider
 * @param reducer (initialState: 初始狀態, action: 更新狀態的action) 
 */
export const creatWowgoStore = (reducer: (initialState: any, action: any) => (any)) => createStore(reducer, composeWithDevTools());

export interface ProviderProps {
    /** 
     * 需要使用本Context的所有子組件 
     */
    children?: React.ReactNode;
    /** 
     * 透過 createWowgoStore(reducer) 創建的Store，
     * 註 : reducer: (initialState: any, action: any) => (any) 
    */
    store: Store<any, any>
}

export const WowgoProvider: React.FC<ProviderProps> = (props) => {
    // console.log(props)
    return (
        <Provider context={Context} store={props.store}>
            {props.children}
        </Provider>
    )
}
