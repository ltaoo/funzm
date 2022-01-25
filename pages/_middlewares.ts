import { getToken } from "@/next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest, res: NextResponse) {
//   if (req.nextUrl.pathname === "/dashboard") {
//     const session = await getToken({
//       req,
//     });
//     if (!session) return NextResponse.redirect("/user/login");
//   }
// }
