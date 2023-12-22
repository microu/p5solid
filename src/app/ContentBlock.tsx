import { Component, ParentProps } from "solid-js";

const ContentBlock: Component<ParentProps<{}>> = (props) => {
  return <div class="mx-2 my-2 p-2 rounded bg-stone-100">{props.children}</div>;
};

export default ContentBlock;
