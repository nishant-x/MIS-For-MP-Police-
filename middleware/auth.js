export async function verifyAuth(req, requiredRoles = []) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (requiredRoles.length && !requiredRoles.includes(verified.role)) return null;

    return verified;
  } catch (err) {
    console.error("Auth verification failed:", err.message);
    return null;
  }
}
