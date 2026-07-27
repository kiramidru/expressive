import { signToken } from "../utils/jwt.js";
import { hashData, verifyHash } from "../utils/bcrypt.js";
import * as userRepository from "../repositories/user.db.js";

function authError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function createSafeUser(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    photoUrl: user.photoUrl,
    role: user.role,
    verified: user.verified,
  };
}

function createAuthResponse(user) {
  const accessTokenExpiresAt = Math.floor(Date.now() / 1000) + 60 * 60;
  const accessToken = signToken({
    id: user.id,
    role: user.role,
    verified: user.verified,
  });

  return {
    ...createSafeUser(user),
    accessToken,
    accessTokenExpiresAt,
  };
}

export async function signup({ email, password, firstName, lastName, role }) {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await userRepository.getUserByEmail(normalizedEmail);

  if (existingUser) {
    throw authError("An account with this email already exists", 409);
  }

  const passwordHash = await hashData(password);

  try {
    const user = await userRepository.createUser({
      email: normalizedEmail,
      passwordHash,
      firstName: firstName.trim(),
      lastName: lastName?.trim() || null,
      role: role || "CUSTOMER",
    });

    return createAuthResponse(user);
  } catch (error) {
    if (error.code === "P2002") {
      throw authError("An account with this email already exists", 409);
    }
    throw error;
  }
}

export async function login({ email, password }) {
  const user = await userRepository.getUserByEmail(normalizeEmail(email));
  const passwordMatches = user
    ? await verifyHash(password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    throw authError("Invalid email or password", 401);
  }

  return createAuthResponse(user);
}

export async function getProfile(id) {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw authError("User not found", 404);
  }

  return createSafeUser(user);
}
