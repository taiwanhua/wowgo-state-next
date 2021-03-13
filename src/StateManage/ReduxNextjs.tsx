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
import { MakeStore, createWrapper, Context } from 'next-redux-wrapper';

export { HYDRATE } from 'next-redux-wrapper';

// export interface State {
//     tick: string;
// }

// create your reducer
// const reducer = (state: State = { tick: 'init' }, action: AnyAction) => {
//     switch (action.type) {
//         case HYDRATE:
//             // Attention! This will overwrite client state! Real apps should use proper reconciliation.
//             return { ...state, ...action.payload };
//         case 'TICK':
//             return { ...state, tick: action.payload };
//         default:
//             return state;
//     }
// };

// create a makeStore function
// const makeStore: MakeStore<State> = (context: Context) => createStore(reducer, composeWithDevTools());

export const creatWowgoStoreForNextjs = <Type,>(reducer: (initialState: any, action: any) => (any)) => {

    const makeStore: MakeStore<Type> = (context: Context) => createStore(reducer, composeWithDevTools());

    return makeStore;
}

// export an assembled wrapper
// export const wrapper = createWrapper<State>(makeStore, { debug: true });

export const WowgoWrapper = <Type,>(storeForNextjs: MakeStore<Type>) => createWrapper<Type>(storeForNextjs, { debug: true });



// Generics ex:
// const wrapInArray1 = <Type,>(input: Type): Type[] => {
//     return [input];
//   };



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