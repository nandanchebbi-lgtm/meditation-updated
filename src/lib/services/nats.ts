import { connect, StringCodec } from "nats.ws";

let nc: any = null;
const sc = StringCodec();

export async function connectNATS() {
  nc = await connect({
    servers: "ws://localhost:4222",
  });

  console.log("Connected to NATS");
}

export async function sendCommand(command: string) {
  if (!nc) {
    console.log("NATS not connected");
    return;
  }

  nc.publish("meditation.command", sc.encode(command));
}