import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/AppLayout";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { Story } from "./components/Story";
import { Gallery } from "./components/Gallery";
import { Memories } from "./components/Memories";
import { Messages } from "./components/Messages";
import { Complaints } from "./components/Complaints";
import { MoodTracker } from "./components/MoodTracker";
import { SecretVault } from "./components/SecretVault";
import { Quiz } from "./components/Quiz";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Home },
      { path: "story", Component: Story },
      { path: "gallery", Component: Gallery },
      { path: "memories", Component: Memories },
      { path: "messages", Component: Messages },
      { path: "complaints", Component: Complaints },
      { path: "moods", Component: MoodTracker },
      { path: "vault", Component: SecretVault },
      { path: "quiz", Component: Quiz },
    ],
  },
]);
