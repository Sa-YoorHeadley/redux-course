import {
  increment,
  decrement,
  reset,
  incrementByAmount,
  decrementByAmount,
} from "./counterSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";

export const Counter = () => {
  const count = useAppSelector((state) => state.counter.count);
  const dispatch = useAppDispatch();

  const [amount, setAmount] = useState<number>(0);

  function resetAll() {
    setAmount(0);
    dispatch(reset());
  }

  return (
    <section>
      <p>{count}</p>

      <button className="" onClick={() => dispatch(increment())}>
        +
      </button>
      <button className="" onClick={() => dispatch(decrement())}>
        -
      </button>

      <label htmlFor="amount"></label>
      <input
        type="number"
        id="amount"
        onChange={(event) => {
          setAmount(parseInt(event.target.value));
        }}
        value={amount}
        title="amount"
      />

      <div className="">
        <button
          onClick={() => {
            dispatch(incrementByAmount(amount));
          }}
        >
          Add Amount
        </button>
        <button
          onClick={() => {
            dispatch(decrementByAmount(amount));
          }}
        >
          Subtract Amount
        </button>
        <button onClick={resetAll}>Reset</button>
      </div>
    </section>
  );
};
