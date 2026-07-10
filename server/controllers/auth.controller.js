import * as authService from "../services/auth.service.js";

export async function auth(req, res) {
  try {
    const { initData } = req.body;
    console.log(initData);
    if (!initData) {
      return res.status(400).json({ error: "Missing initData" });
    }

    const user = await authService.auth(initData);
    return res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    console.log(username, password);

    const user = await authService.login(username, password);
    return res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function signup(req, res) {
  try {
    const { username, password } = req.body;
    console.log(username, password);

    const user = await authService.login(username, password);
    return res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
