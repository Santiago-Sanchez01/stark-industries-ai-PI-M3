// Construye visualmente un mensaje
export function createMessageElement(message) {
  const element = document.createElement("div");

  const speaker = message.role === "notice" ? "system" : message.role === "user" ? "user" : message.character === "doom" ? "doom" : "tony";
  element.dataset.speaker = speaker;

  if (message.role === "notice") {
    // Presentation metadata belongs to the notice, never to the current theme.
    element.dataset.noticeType = message.noticeType === "intrusion" ? "intrusion" : "recovery";
    element.className = "protocol-notice";
    element.textContent = message.text;
    return element;
  }

  element.className = "message";

  element.classList.add(
    message.role === "user"
      ? "user-message"
      : "ai-message"
  );

  const author = document.createElement("span");
  author.className = "message-author";

  if (message.role === "user") {
    author.textContent = "VOS";
  } else {
    author.textContent =
      message.character === "doom"
        ? "DOCTOR DOOM"
        : "TONY STARK";
  }

  const content = document.createElement("p");
  content.textContent = message.text;

  if (speaker === "tony" || speaker === "doom") {
    const avatar = document.createElement("img");
    avatar.className = "message-avatar";
    avatar.src = speaker === "doom" ? "/assets/doom-cinematic.jpg" : "/assets/iron-avatar.svg";
    avatar.alt = "";
    avatar.setAttribute("aria-hidden", "true");
    element.append(avatar);
  }
  element.append(author, content);

  if (message.character === "doom") {
    element.classList.add("doom-message");
  }

  return element;
}


