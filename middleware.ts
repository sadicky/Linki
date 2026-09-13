import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les fichiers statiques, images et api webhooks
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Vérifier la session Supabase
  const { supabaseResponse, user, supabase } = await updateSession(request);

  // Récupération de rôle via cookie de session
  const sessionRole = request.cookies.get("linki_user_role")?.value;

  let userRole: string | null = null;
  let userStatus: string | null = null;

  if (user) {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", user.id)
        .single();
      const profile = data as unknown as { role?: string; status?: string } | null;
      if (profile) {
        userRole = profile.role || null;
        userStatus = profile.status || null;
      }
    } catch {
      // Ignorer
    }
  }

  // Session fallback si le profil est en cookie
  if (!userRole && sessionRole) {
    userRole = sessionRole;
    userStatus = "actif";
  }

  // Protection de l'espace Restaurant: /dashboard/restaurant
  if (pathname.startsWith("/dashboard/restaurant")) {
    if (!userRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userStatus === "en_attente_validation") {
      return NextResponse.redirect(new URL("/pending-approval", request.url));
    }
    if (userRole !== "restaurant" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protection de l'espace Livreur: /dashboard/livreur
  if (pathname.startsWith("/dashboard/livreur")) {
    if (!userRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userStatus === "en_attente_validation") {
      return NextResponse.redirect(new URL("/pending-approval", request.url));
    }
    if (userRole !== "livreur" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protection de l'espace Admin: /admin
  if (pathname.startsWith("/admin")) {
    if (!userRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
