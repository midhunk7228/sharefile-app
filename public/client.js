// public/client.js
const socket = io();
let peers = {};

socket.on("users-update", (users) => {
  const usersList = document.getElementById("usersList");
  usersList.innerHTML = "";
  debugger;
  users.forEach((user) => {
    if (user.id !== socket.id) {
      const userElement = document.createElement("div");
      userElement.className = "user-item";
      userElement.innerHTML = `
                ${user.name}
                <button onclick="sendFile('${user.id}')">Send File</button>
            `;
      usersList.appendChild(userElement);
    }
  });
});

function sendFile(userId) {
  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files.length) {
    alert("Please select a file first!");
    return;
  }

  const file = fileInput.files[0];
  const peer = new SimplePeer({ initiator: true });

  peer.on("signal", (data) => {
    socket.emit("signal", {
      to: userId,
      from: socket.id,
      signal: data,
    });
  });

  peer.on("connect", () => {
    // Send file metadata
    peer.send(
      JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      })
    );

    // Read and send file
    const reader = new FileReader();
    reader.onload = (e) => {
      const chunks = chunkArray(new Uint8Array(e.target.result), 16384);
      chunks.forEach((chunk) => peer.send(chunk));
      peer.send("EOF");
    };
    reader.readAsArrayBuffer(file);
  });

  peers[userId] = peer;
}

socket.on("signal", ({ from, signal }) => {
  if (!peers[from]) {
    debugger;
    const peer = new SimplePeer();
    peer.on("data", handleIncomingData);
    peers[from] = peer;
  }
  peers[from].signal(signal);
});

let incomingFileData = null;
let receivedSize = 0;

function handleIncomingData(data) {
  const statusElement = document.getElementById("transferStatus");

  if (typeof data === "string") {
    try {
      const metadata = JSON.parse(data);
      incomingFileData = {
        chunks: [],
        ...metadata,
      };
      statusElement.textContent = `Receiving ${metadata.fileName}...`;
    } catch {
      if (data === "EOF") {
        const blob = new Blob(incomingFileData.chunks, {
          type: incomingFileData.fileType,
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = incomingFileData.fileName;
        a.click();

        statusElement.textContent = "Transfer complete!";
        incomingFileData = null;
        receivedSize = 0;
      }
    }
  } else {
    incomingFileData.chunks.push(data);
    receivedSize += data.length;
    const progress = Math.round(
      (receivedSize / incomingFileData.fileSize) * 100
    );
    statusElement.textContent = `Receiving ${incomingFileData.fileName}: ${progress}%`;
  }
}

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
