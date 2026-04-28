import { ConvexClient } from "https://esm.sh/convex@1.28.2/browser";

const convex = new ConvexClient("https://fast-bear-5.convex.cloud");

const form = document.getElementById("prayer-form");
const statusMessage = document.getElementById("statusMessage");
const submitButton = document.getElementById("submitButton");

function setStatus(message, tone) {
  statusMessage.textContent = message;
  statusMessage.classList.remove("success", "error");
  if (tone) {
    statusMessage.classList.add(tone);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  setStatus("Submitting...", null);

  const firstName = document.getElementById("firstName").value.trim();
  const prayerRequest = document.getElementById("prayerRequest").value.trim();
  const emailRaw = document.getElementById("email").value.trim();
  const isPrivate = document.getElementById("isPrivate").checked;

  try {
    await convex.mutation("prayerRequests:submit", {
      firstName,
      prayerRequest,
      email: emailRaw.length > 0 ? emailRaw : undefined,
      isPrivate,
    });

    form.reset();
    setStatus("Thank you. Your prayer request was submitted.", "success");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    setStatus(message, "error");
  } finally {
    submitButton.disabled = false;
  }
});
