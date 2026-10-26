
export const PROTOCOL_STATES = {
  NORMAL: "normal",
  ALERT: "alert",
  DOOM: "doom",
  RECOVERY: "recovery",
};

let currentState = PROTOCOL_STATES.NORMAL;
let transitionTimer = null;

export function getProtocolState() {
  return currentState;
}

function updateProtocolUI() {
  document.body.dataset.protocol = currentState;

  const banner = document.querySelector("#protocol-banner");
  const status = document.querySelector("#protocol-status");
  const flag = document.querySelector("#latveria-panel");
  const recoverButton = document.querySelector("#recover-button");
  const input = document.querySelector("#message-input");

  const labels = {
    normal: "TONY STARK",
    alert: "INTRUSIÓN DETECTADA",
    doom: "DOCTOR DOOM",
    recovery: "J.A.R.V.I.S. RESTAURANDO SISTEMA",
  };

  if (status) {
    status.textContent = labels[currentState];
  }

  if (banner) {
    banner.hidden = currentState === PROTOCOL_STATES.NORMAL;

    const alerts = {
      alert: "⚠ SECURITY BREACH DETECTED",
      doom: "⚠ DOOM PROTOCOL ACTIVE",
      recovery: "J.A.R.V.I.S. // RECUPERANDO CONTROL",
    };

    banner.textContent = alerts[currentState] || "";
  }

  if (flag) {
    flag.hidden = currentState !== PROTOCOL_STATES.DOOM;
  }

  if (recoverButton) {
    recoverButton.hidden =
      currentState !== PROTOCOL_STATES.DOOM;
  }

 
if (input) {
  input.disabled =
    currentState === PROTOCOL_STATES.ALERT ||
    currentState === PROTOCOL_STATES.RECOVERY;
}


  document.dispatchEvent(
    new CustomEvent("protocolchange", {
      detail: { state: currentState },
    })
  );
}

function changeState(newState) {
  currentState = newState;
  updateProtocolUI();
}

export function activateDoomProtocol() {
  if (currentState !== PROTOCOL_STATES.NORMAL) {
    return false;
  }

  clearTimeout(transitionTimer);
  changeState(PROTOCOL_STATES.ALERT);

  transitionTimer = setTimeout(() => {
    changeState(PROTOCOL_STATES.DOOM);
    transitionTimer = null;
  }, 1800);

  return true;
}

export function restoreJarvisControl() {
  if (currentState !== PROTOCOL_STATES.DOOM) {
    return false;
  }

  clearTimeout(transitionTimer);
  changeState(PROTOCOL_STATES.RECOVERY);

  transitionTimer = setTimeout(() => {
    changeState(PROTOCOL_STATES.NORMAL);
    transitionTimer = null;
  }, 1800);

  return true;
}

export function initDoomProtocol() {
  const recoverButton = document.querySelector("#recover-button");

  if (recoverButton) {
    recoverButton.addEventListener(
      "click",
      restoreJarvisControl
    );
  }

  updateProtocolUI();
}
