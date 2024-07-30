/* eslint-disable no-undef */
import fs from "fs";
import rsaPemToJwk from "rsa-pem-to-jwk";

const privateKeyPem = fs.readFileSync("certs/private.pem");

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const jwk = rsaPemToJwk(privateKeyPem, { use: "sig" }, "public");

// eslint-disable-next-line no-console
console.log(jwk);
