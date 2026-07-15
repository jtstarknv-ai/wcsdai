// WCSD AI Hub contact form: sends the submission to the AI team's inbox.
// Requires two SWA application settings (see AZURE-SETUP.md):
//   ACS_CONNECTION_STRING  - Azure Communication Services connection string
//   CONTACT_SENDER         - the verified sender address (e.g. DoNotReply@<your-domain>.azurecomm.net)
// Optional: CONTACT_TO (defaults to ai@washoeschools.net)

module.exports = async function (context, req) {
  const body = req.body || {};
  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 200);
  const comment = String(body.comment || "").trim().slice(0, 5000);
  const honeypot = String(body.website || "").trim(); // hidden field, humans leave it empty

  if (honeypot) { context.res = { status: 200, jsonBody: { ok: true } }; return; }
  if (!name || !comment || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    context.res = { status: 400, jsonBody: { ok: false, error: "invalid" } }; return;
  }

  const conn = process.env.ACS_CONNECTION_STRING;
  const sender = process.env.CONTACT_SENDER;
  const to = process.env.CONTACT_TO || "ai@washoeschools.net";

  if (!conn || !sender) {
    context.res = { status: 503, jsonBody: { ok: false, error: "not-configured" } }; return;
  }

  try {
    const { EmailClient } = require("@azure/communication-email");
    const client = new EmailClient(conn);
    const poller = await client.beginSend({
      senderAddress: sender,
      recipients: { to: [{ address: to }] },
      replyTo: [{ address: email, displayName: name }],
      content: {
        subject: "AI Hub question or idea from " + name,
        plainText:
          comment +
          "\n\n---\nFrom: " + name + " (" + email + ")\nSent from the WCSD AI Hub contact page"
      }
    });
    await poller.pollUntilDone();
    context.res = { status: 200, jsonBody: { ok: true } };
  } catch (e) {
    context.log.error("contact send failed", e && e.message);
    context.res = { status: 502, jsonBody: { ok: false, error: "send-failed" } };
  }
};
