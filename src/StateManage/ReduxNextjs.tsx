import * as React from 'react'

import {
    // Provider,
    // createStoreHook,
    // createDispatchHook,
    // createSelectorHook,
    // ReactReduxContextValue,
    useSelector,
    useDispatch
} from 'react-redux'
import {
    // AnyAction,
    createStore,
    // Store
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { MakeStore, createWrapper, Context } from 'next-redux-wrapper';

import { HYDRATE as H } from 'next-redux-wrapper';


/**
 * HYDRATE 是一個action的名字，此action 會再初始時執行，用以調和(合併或覆蓋) 伺服器端與客戶端狀態
 * 
 * @example
 * // reducer 是經過處理，要作為 createWowgoStore 的參數創建store
 * const reducer = (state, action) => {
 *   if (action.type === HYDRATE) {
 *     const nextState = {
 *       ...state, // use previous state
 *       ...action.payload, // apply delta from hydration
 *     }
 *     // if (state.count.count) nextState.count.count = state.count.count // preserve count value on client side navigation
 *     return nextState
 *   } else {
 *     return combinedReducer(state, action)
 *   }
 * }
 * 
 * const combinedReducer = combineReducers({
 *   reducer1,
 *   reducer2,
 *   ...
 * })
 * 
 * // reducer1 範例
 *  export interface S {
 *     todo: number
 * }
 * 
 * const reducer1 = (state: S = { todo: 0 }, action: any) => {
 *
 *     switch (action.type) {
 *         case "INCREMENT":
 *             return {
 *                 ...state,
 *                 todo: state.todo + action.step
 *             };
 *         case "DECREMENT":
 *             return {
 *                 ...state,
 *                 todo: state.todo - action.step
 *             };
 *         default:
 *             return state;
 *     }
 * }
 *
 */
export const HYDRATE = H;

/**
 * 
 * @param reducer 處理 HYDRATE、combinedReducer 之後的 reducer
 * @returns 回傳值，用以作為 WowgoWrapper 參數
 * @example
 * // 在page 資料夾下創建檔案 _app.tsx
 * import React, { FC } from 'react';
 * import { AppProps } from 'next/app';
 * import { WowgoProvider, useWowgoDispatch, useWowgoSelector, WowgoWrapper, creatWowgoStore, combineReducers, HYDRATE } from 'wowgo-state-next'
 *
 * const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => (
 *     <Component {...pageProps} />
 * );
 *
 * const store = creatWowgoStore(reducer);
 *
 * export default WowgoWrapper(store).withRedux(WrappedApp);
 */
export const createWowgoStore = <Type,>(reducer: (initialState: any, action: any) => (any)) => {

    const makeStore: MakeStore<Type> = (context: Context) => createStore(reducer, composeWithDevTools());

    return makeStore;
}
/**
 * 
 * @param store 透過 createWowgoStore 創建的 stoer
 * @returns 回傳用以包裝App組件的 "Wrapper"
 * 
 * @example
 * // 在page 資料夾下創建檔案 _app.tsx
 * import React, { FC } from 'react';
 * import { AppProps } from 'next/app';
 * import { WowgoProvider, useWowgoDispatch, useWowgoSelector, WowgoWrapper, creatWowgoStore, combineReducers, HYDRATE } from 'wowgo-state-next'
 *
 * const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => (
 *     <Component {...pageProps} />
 * );
 *
 * const store = creatWowgoStore(reducer);
 *
 * export default WowgoWrapper(store).withRedux(WrappedApp);
 */
export const WowgoWrapper = <Type,>(store: MakeStore<Type>) => createWrapper<Type>(store, { debug: true });

/**
 * 
 * @param selector 篩選函數
 * @param equalityFn 判斷篩選函數
 * @returns 篩選過後的狀態值
 * 
 * @example
 * 
 * export interface S {
 *     todo: number
 * }
 * 
 * const AboutPage = (props: any) => {
 * 
 *  const todo = useWowgoSelector<S, number>(state => state.reducer1.todo)
 * 
 *  return (
 *      <p>
 *          {todo}
 *      </p>
 *  )
 * 
 * export default AboutPage
 */
export const useWowgoSelector = <Type, TSelected = unknown>(
    selector: (state: Type) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected => {

    const selectValue = useSelector<Type, TSelected>(selector, equalityFn)

    return selectValue;
}

/**
 * 
 * @returns dispatch 函數
 * 
 * @example
 * const AboutPage = (props: any) => {
 * 
 *  const todo = useWowgoDispatch()
 * 
 *  return (
 *      <button onClick={() => {  dispatch({ type: "INCREMENT", step: 1 }) }}>
 *          INCREMENT
 *      </button>
 *  )
 * 
 * export default AboutPage
 */
export const useWowgoDispatch = () => {

    const dispatch = useDispatch()

    return dispatch;
}


//Next.js reducer example

// import { createStore, applyMiddleware, combineReducers } from 'redux'
// import { HYDRATE, createWrapper } from 'next-redux-wrapper'
// import thunkMiddleware from 'redux-thunk'
// import count from './count/reducer'
// import tick from './tick/reducer'

// const bindMiddleware = (middleware) => {
//   if (process.env.NODE_ENV !== 'production') {
//     const { composeWithDevTools } = require('redux-devtools-extension')
//     return composeWithDevTools(applyMiddleware(...middleware))
//   }
//   return applyMiddleware(...middleware)
// }

// const combinedReducer = combineReducers({
//   count,
//   tick,
// })

// const reducer = (state, action) => {
//   if (action.type === HYDRATE) {
//     const nextState = {
//       ...state, // use previous state
//       ...action.payload, // apply delta from hydration
//     }
//     if (state.count.count) nextState.count.count = state.count.count // preserve count value on client side navigation
//     return nextState
//   } else {
//     return combinedReducer(state, action)
//   }
// }

// const initStore = () => {
//   return createStore(reducer, bindMiddleware([thunkMiddleware]))
// }

// export const wrapper = createWrapper(initStore)


// use ex:
// import React, {FC} from 'react';
// import {AppProps} from 'next/app';
// import {wrapper} from '../components/store';

// const WrappedApp: FC<AppProps> = ({Component, pageProps}) => (
//     <Component {...pageProps} />
// );

// export default wrapper.withRedux(WrappedApp);


// use Step
// create file named _app.tsx
// 
// import React, { FC } from 'react';
// import { AppProps } from 'next/app';
// import { WowgoProvider, useWowgoDispatch, useWowgoSelector, WowgoWrapper, creatWowgoStore, combineReducers, HYDRATE } from 'wowgo-state-next'
//
// const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => (
//     <Component {...pageProps} />
// );
//
// const store = creatWowgoStore(reducer);
//
// export default WowgoWrapper(store).withRedux(WrappedApp);
//
// Ok, then create reducers (reducer1, reducer2...) :
//
// export interface S {
//     todo: number
// }
// 
// const reducer1 = (state: S = { todo: 0 }, action: any) => {
//
//     console.log(state, action)
//     switch (action.type) {
//         case "INCREMENT":
//             return {
//                 ...state,
//                 todo: (state?.todo ?? 0) + action.step
//             };
//         case "DECREMENT":
//             return {
//                 ...state,
//                 // todo1: state.todo1 - action.step
//             };
//         default:
//             return state;
//     }
// }
//
// then combinedReducer : 
// 
// const combinedReducer = combineReducers({
//     reducer1,
//     reducer2,
//     ...
// })
