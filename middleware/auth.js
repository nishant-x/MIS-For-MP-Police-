import jwt from "jsonwebtoken";

export async function verifyAuth(req, requiredRoles = []) {
  try {
    // ✅ Extract token from request cookies manually
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      console.error("❌ No token found in cookies");
      return null;
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (requiredRoles.length && !requiredRoles.includes(verified.role)) {
      console.error("❌ Unauthorized role:", verified.role);
      return null;
    }

    return verified; // { id, role, iat, exp }
  } catch (err) {
    console.error("Auth verification failed:", err.message);
    return null;
  }
}
