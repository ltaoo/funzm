import supabase from "../utils/request";

/**
 * 注册用户
 */
export async function register({ email, password }) {
  const { user, session, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return user;
}

/**
 * 用户登录
 */
export async function login({ email, password }) {
  const { user, session, error } = await supabase.auth.signIn({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return user;
}
