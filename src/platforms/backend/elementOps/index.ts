function addEventListeners(
  el: HTMLElement,
  name: string,
  handler: EventListener
) {
  el.addEventListener(name, handler);
}

function removeEventListeners(
  el: HTMLElement,
  name: string,
  handler: EventListener
) {
  el.removeEventListener(name, handler);
}

export default { addEventListeners, removeEventListeners };
