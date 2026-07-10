import jwtEncode from "jwt-encode";

export function generateToken() {
    const secret =
        "coETaYIOXmMOGC6of+kvxIWiVTWw83Ss+9et9MSbcjid4HGtvSW0z/Ek00t3Imim"; // only for testing
    const payload = {
        id: 3,
        role: "CUSTOMER",
    };

    const token = jwtEncode(payload, secret);
    return token;
}
