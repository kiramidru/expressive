import * as authService from "../services/auth.service.js";

function sendAuthError(res, error) {
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Internal Server Error" : error.message;
  return res.status(statusCode).json({ error: message });
}

export async function login(req, res) {
  try {
    const user = await authService.login(req.body);
    return res.status(200).json(user);
  } catch (err) {
    return sendAuthError(res, err);
  }
}

export async function signup(req, res) {
  try {
    const user = await authService.signup(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return sendAuthError(res, err);
  }
}

export async function getProfile(req, res) {
  try {
    const user = await authService.getProfile(req.user.id);
    return res.status(200).json(user);
  } catch (err) {
    return sendAuthError(res, err);
  }
}
