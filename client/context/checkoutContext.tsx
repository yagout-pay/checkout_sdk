'use client';

import React, { createContext, useReducer, useEffect, ReactNode } from 'react';


export interface CheckoutStep {
  id: number;
  title: string;
  completed: boolean;
}

export interface CheckoutState {
  currentStep: number;
  steps: Record<number, CheckoutStep>;
}

export type CheckoutAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'COMPLETE_STEP'; payload: number }
  | { type: 'RESET' };

const initialState: CheckoutState = {
  currentStep: 1,
  steps: {
    1: { id: 1, title: 'Shipping', completed: false },
    2: { id: 2, title: 'Payment', completed: false },
    3: { id: 3, title: 'Confirmation', completed: false },
  },
};

const localStorageKey = 'checkoutState';

function loadState(): CheckoutState {
  if (typeof window === 'undefined') return initialState;

  try {
    const saved = localStorage.getItem(localStorageKey);
    return saved ? JSON.parse(saved) : initialState;
  } catch {
    return initialState;
  }
}

function reducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'COMPLETE_STEP':
      return {
        ...state,
        steps: {
          ...state.steps,
          [action.payload]: { ...state.steps[action.payload], completed: true },
        },
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const CheckoutContext = createContext<{
  state: CheckoutState;
  dispatch: React.Dispatch<CheckoutAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(localStorageKey, JSON.stringify(state));
    }
  }, [state]);

  return (
    <CheckoutContext.Provider value={{ state, dispatch }}>
      {children}
    </CheckoutContext.Provider>
  );
}
