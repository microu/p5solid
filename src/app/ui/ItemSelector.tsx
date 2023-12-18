import { $C } from "@microu-mts/dom";
import { Component, For, createSignal } from "solid-js";

type TProps = {
  items: string[];
  selection?: number;
  handler?: (item: string, index: number) => void;
};

const ItemSelector: Component<TProps> = (props) => {
  const [iselected, setIselected] = createSignal(-1);
  if (
    props.selection != undefined &&
    props.selection >= 0 &&
    props.selection < props.items.length
  ) {
    setIselected(props.selection)
  }
  function handleClick(i: number) {
    setIselected(i);
    if (props.handler) {
      props.handler(props.items[i], i);
    }
  }

  return (
    <div class="gap-1 flex flex-1 flex-wrap bg-slate-200 p-1 items-start justify-start content-start">
      <For each={props.items}>
        {(label, i) => (
          <ItemSelectorItem
            label={label}
            selected={i() == iselected()}
            handler={() => handleClick(i())}
          />
        )}
      </For>
    </div>
  );
};

const ItemSelectorItem: Component<{
  label: string;
  selected?: boolean;
  handler?: () => void;
}> = (props) => {
  const classes = () => {
    return (
      $C(
        '<tw class="bg-rose-800  hover:bg-rose-600 text-stone-200 font-bold p-1 rounded-lg"'
      ) +
      " " +
      $C('<tw class="select-none cursor-pointer"') +
      (props.selected ? " " + $C('<tw class="border-rose-400 border-4"') : "")
    );
  };

  return (
    <div
      class={classes()}
      onClick={() => {
        if (props.handler) {
          props.handler();
        }
      }}
    >
      {props.label}
    </div>
  );
};

export default ItemSelector;
