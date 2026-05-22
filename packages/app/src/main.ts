import { define } from "@unbndl/html";
import { Auth } from "@unbndl/auth";

import { AppHeaderElement } from "./components/app-header.ts";
import { HomeViewElement } from "./views/home-view.ts";
import { AboutViewElement } from "./views/about-view.ts";

class RouterSwitchElement extends HTMLElement {
  connectedCallback() {
    this.renderRoute();

    window.addEventListener("popstate", () => {
      this.renderRoute();
    });

    document.addEventListener("click", (event) => {
      const target = event.composedPath()[0] as HTMLElement;
      const link = target.closest?.("a");

      if (!link) return;

      const href = link.getAttribute("href");

      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.endsWith(".html")
      ) {
        return;
      }

      event.preventDefault();
      history.pushState(null, "", href);
      this.renderRoute();
    });
  }

  renderRoute() {
    const path = window.location.pathname;

    if (path === "/") {
      history.replaceState(null, "", "/app");
      this.renderRoute();
      return;
    }

    if (path === "/app") {
      this.innerHTML = "<home-view></home-view>";
      return;
    }

    if (path === "/app/about") {
      this.innerHTML = "<about-view></about-view>";
      return;
    }

    this.innerHTML = "<main><h2>Not Found</h2></main>";
  }
}

define({
  "auth-provider": Auth.Provider,
  "app-header": AppHeaderElement,
  "router-switch": RouterSwitchElement,
  "home-view": HomeViewElement,
  "about-view": AboutViewElement
});