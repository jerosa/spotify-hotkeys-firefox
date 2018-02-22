const manifest = browser.runtime.getManifest();
const commands = manifest.commands;

function sendCommand(ev) {
    const command = ev.target.dataset.command;
    if (command in commands) {
        browser.runtime.sendMessage(command);
    }
}

function createCommandMarkup(commandName, command) {
    const li = document.createElement("li");
    li.innerHTML = `<p data-command=${commandName}>${commandName} - ${command.suggested_key.default}</p><p><small>${command.description}</small></p>`;
    li.addEventListener("click", sendCommand);
    return li;
}

// Set title
const content = document.querySelector("#title");
content.innerHTML = manifest.name;

// Create the commands list
const commandsFragment = document.createDocumentFragment();
for (let command in commands) {
    commandsFragment.appendChild(createCommandMarkup(command, commands[command]));
}
document.querySelector("#commands").appendChild(commandsFragment);