/* global browser document */
async function init() {
    const manifest = browser.runtime.getManifest();
    const commands = await browser.commands.getAll();

    function sendCommand(ev) {
        const { command } = ev.target.dataset;
        if (command !== undefined) {
            browser.runtime.sendMessage(command);
        }
    }

    function createCommandMarkup(commandName, command) {
        const li = document.createElement("li");
        const p1 = document.createElement("p");
        p1.dataset.command = `${commandName}`;
        p1.appendChild(document.createTextNode(`${commandName} - ${command.shortcut}`));
        li.appendChild(p1);
        const p2 = document.createElement("p");
        const small = document.createElement("small");
        small.appendChild(document.createTextNode(`${command.description}`));
        p2.appendChild(small);
        li.appendChild(p2);
        li.addEventListener("click", sendCommand);
        return li;
    }

    // Set title
    const content = document.querySelector("#title");
    content.appendChild(document.createTextNode(manifest.name));

    // Create the commands list
    const commandsFragment = document.createDocumentFragment();
    for (const command in commands) {
        commandsFragment.appendChild(createCommandMarkup(commands[command].name, commands[command]));
    }
    document.querySelector("#commands").appendChild(commandsFragment);
}

init();
