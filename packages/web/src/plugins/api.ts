import { SiweMessage } from "siwe";

const API_HOSTNAME = process.env.VITE_API_HOSTNAME || "http://localhost:3000";

const domain = window.location.host;
const origin = window.location.origin;

export async function createSiweMessage(
  address: string,
  statement: string,
  chainId: number
) {
  const res = await fetch(`${API_HOSTNAME}/siwe/nonce`, {
    credentials: "include",
  });

  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId,
    nonce: await res.text(),
  });
  return message.prepareMessage();
}

export async function signIn(
  message: string,
  signature: string,
  userAddress: string
) {
  const res = await fetch(`${API_HOSTNAME}/siwe/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, signature, userAddress }),
    credentials: "include",
  });
  console.log(await res.text());
}

export type SessionInfo = {
  authenticated: boolean;
  adderss: string;
  message: string;
};
export async function getUserSession(): Promise<SessionInfo> {
  const res = await fetch(`${API_HOSTNAME}/siwe/me`, {
    credentials: "include",
  });

  const info: SessionInfo = res.json();

  return info;
}
