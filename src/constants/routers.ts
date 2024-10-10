import DashboardIcon from "@/components/icons/DashboardIcon";
import KanbanIcon from "@/components/icons/KanbanIcon";
import { ReactNode } from "react";

interface Routers {
  href: string;
  name: string;
  icon?: ReactNode;
}

export const MAIN_ROUTERS: Array<Routers> = [
  { href: "/", name: "Dasboard", icon: DashboardIcon() },
  { href: "/users", name: "Users", icon: KanbanIcon() },
];

export const SUB_ROUTERS: Array<Routers> = [

];
