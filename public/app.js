
const filenameInput = document.getElementById("filename");
const filecontentInput = document.getElementById("content");
const messageInput = document.getElementById("message");
const fileList = document.getElementById("fileList");
const systemInfo = document.getElementById("systemInfo");

// Create a file
async function createFile() {
    const fileName = filenameInput.value.trim();
    const filecontent = filecontentInput.value;

    if (!fileName) {
        messageInput.textContent = "Please enter a filename.";
        return;
    }

    try {
        const response = await fetch("/api/createFile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fileName: fileName,
                filecontent: filecontent
            })
        });

        const data = await response.json();
        messageInput.textContent = data.message;

        if (response.ok) {
            filenameInput.value = "";
            filecontentInput.value = "";
            getFiles();
        }
    } catch (error) {
        messageInput.textContent = "Unable to connect to the server.";
    }
}

// Display all files
async function getFiles() {
    try {
        const response = await fetch("/api/files");
        const data = await response.json();

        fileList.replaceChildren();

        if (!response.ok) {
            throw new Error(data.message || "Could not load files");
        }

        if (data.files.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No files found.";
            fileList.appendChild(li);
            return;
        }

        data.files.forEach((filename) => {
            const li = document.createElement("li");
            li.textContent = filename;
            fileList.appendChild(li);
        });
    } catch (error) {
        fileList.replaceChildren();

        const li = document.createElement("li");
        li.textContent = "Unable to load files.";
        fileList.appendChild(li);
    }
}

// Display system information
async function getSystemInfo() {
    try {
        const response = await fetch("/api/systemInfo");
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Could not load system information");
        }

        systemInfo.textContent =
            `Platform: ${data.platform} | ` +
            `Architecture: ${data.architecture} | ` +
            `Hostname: ${data.hostname} | ` +
            `Total Memory: ${data.totalMemory} | ` +
            `Free Memory: ${data.freeMemory} | ` +
            `System Uptime: ${data.uptime}`;
    } catch (error) {
        systemInfo.textContent =
            "Unable to load system information.";
    }
}
