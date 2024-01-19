import { P5Div } from "@src/p5div";
import AppLayout from "./AppLayout";
import { sampleA } from "./p5samples/sampleA";
import { sampleB } from "./p5samples/sampleB";
import ContentBlock from "./ContentBlock";
import { For } from "solid-js";

function AppHome() {
  const pages = [
    { text: "Test layout", href: "./index_test_layout.html" },
    { text: "Tick Runnables", href: "./index_tick_runnables.html" },
    { text: "Collatz drawings", href: "./index_collatz.html" },
  ];

  return (
    <AppLayout title="P5 /Solid (step2)">
      <P5Div runner={sampleA()}></P5Div>
      <ContentBlock>
        Top and bottom banners on this page use only
        <code class="font-mono text-red-900"> P5Div</code> and
        <code class="font-mono text-red-900"> P5Runner</code>
      </ContentBlock>
      <ContentBlock>
        <ul class="list-disc list-inside">
          <For each={pages}>
            {(page) => (
              <li class="hover:bg-pink-100 underline underline-offset-8">
                <a href={page.href}>{page.text}</a>
              </li>
            )}
          </For>
        </ul>
      </ContentBlock>

      <P5Div runner={sampleB()}></P5Div>
    </AppLayout>
  );
}

export default AppHome;
