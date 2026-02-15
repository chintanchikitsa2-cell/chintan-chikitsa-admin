"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 border-r bg-background p-4 flex flex-col justify-between">
      <div className="space-y-8">
        <div className="flex">
          <AspectRatio ratio={1} className="w-12 h-12 shrink-0">
            <Image src="/logo.jpg" alt="logo" fill className="rounded-md" />
          </AspectRatio>

          <div className="">
            <p className="text-lg font-semibold text-nowrap ">Chintan Chikitsa</p>
            <p className="text-sm text-muted-foreground text-nowrap">Admin Portal</p>
          </div>
        </div>

        <NavigationMenu orientation="vertical">
          <NavigationMenuList className="flex-col gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`px-4 py-2 rounded-md ${isActive("/web-app/event")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                <Link href="/web-app/event">Manage Events</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`px-4 py-2 rounded-md ${isActive("/web-app/registration")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                <Link href="/web-app/registration">Registrations</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

      </div>

      <div className="flex items-center gap-3 border-t pt-4">
        <Avatar>
          <AvatarFallback>AG</AvatarFallback>
        </Avatar>

        <div>
          <p className="text-sm font-medium">Deepalli Sharma</p>
          <p className="text-muted-foreground text-sm">Super Admin</p>
        </div>
      </div>
    </aside>
  );
}
