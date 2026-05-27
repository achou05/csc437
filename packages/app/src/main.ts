import { define } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { Store } from "@unbndl/store";
import { BrowserHistory } from "@unbndl/switch";

import { AppHeaderElement } from "./components/app-header.ts";
import { TaskFormElement } from "./components/task-form.ts";
import { HomeViewElement } from "./views/home-view.ts";
import { AboutViewElement } from "./views/about-view.ts";
import { Model, init } from "./model.ts";
import { Msg } from "./messages.ts";
import { update, Cmd } from "./update.ts";

function isSignedIn() {
  return Boolean(
    localStorage.getItem("un-auth:token") || localStorage.getItem("token")
  );
}

class RouterSwitchElement extends HTMLElement {
  connectedCallback() {
    this.renderRoute();

    window.addEventListener("popstate", () => {
      this.renderRoute();
    });

    document.addEventListener("click", (event) => {
      const target = event
        .composedPath()
        .find((node): node is Element => node instanceof Element);
      const link = target?.closest("a");

      if (!link) return;

      const url = new URL(link.href);
      const href = `${url.pathname}${url.search}`;

      if (
        url.origin !== window.location.origin ||
        url.hash ||
        url.pathname.endsWith(".html")
      ) {
        return;
      }

      if (!event.defaultPrevented) {
        event.preventDefault();
        history.pushState(null, "", href);
      }

      this.renderRoute();
    });
  }

  renderRoute() {
    const path = window.location.pathname;

    if (path === "/") {
      if (isSignedIn()) {
        history.replaceState(null, "", "/app");
        this.renderRoute();
      } else {
        window.location.href = "/login.html";
      }
      return;
    }

    if (path === "/app" || path === "/app/completed") {
      if (!isSignedIn()) {
        window.location.href = "/login.html";
        return;
      }

      refreshHeader();
      this.innerHTML = "<home-view></home-view>";
      return;
    }

    if (path === "/app/about") {
      refreshHeader();
      this.innerHTML = "<about-view></about-view>";
      return;
    }

    refreshHeader();
    this.innerHTML = "<main><h2>Not Found</h2></main>";
  }
}

function refreshHeader() {
  document.querySelector<AppHeaderElement>("app-header")?.render();
}

define({
  "history-provider": BrowserHistory.Provider,
  "auth-provider": Auth.Provider,
  "store-provider": class AppStore extends Store.Provider<Model, Msg, Cmd> {
    constructor() {
      super(update, init);
    }
  },
  "app-header": AppHeaderElement,
  "task-form": TaskFormElement,
  "router-switch": RouterSwitchElement,
  "home-view": HomeViewElement,
  "about-view": AboutViewElement
});
