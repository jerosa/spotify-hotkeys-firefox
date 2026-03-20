async function init() {
    const manifest = browser.runtime.getManifest();
    const commands = await browser.commands.getAll();

    function sendCommand(ev) {
        const li = ev.target.closest("li");
        if (!li) return;
        const { command } = li.dataset;
        if (command !== undefined) {
            browser.runtime.sendMessage(command).catch(
                (e) => console.log(e)
            );
        }
    }

    function handleKeydown(ev) {
        if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            sendCommand(ev);
        }
    }

    function createCommandMarkup(command) {
        const li = document.createElement("li");
        li.dataset.command = command.name;
        li.setAttribute("role", "button");
        li.setAttribute("tabindex", "0");

        const description = document.createElement("p");
        description.classList.add("command-description");
        description.textContent = command.description;
        li.appendChild(description);

        const shortcut = document.createElement("p");
        const kbd = document.createElement("kbd");
        kbd.textContent = command.shortcut || "Not set";
        shortcut.appendChild(kbd);
        li.appendChild(shortcut);

        li.addEventListener("click", sendCommand);
        li.addEventListener("keydown", handleKeydown);
        return li;
    }

    document.querySelector("#title").textContent = manifest.name;

    const fragment = document.createDocumentFragment();
    for (const command of commands) {
        if (command.name.startsWith("_")) continue;
        fragment.appendChild(createCommandMarkup(command));
    }
    document.querySelector("#commands").appendChild(fragment);
}

init().catch((e) => console.error(e));
