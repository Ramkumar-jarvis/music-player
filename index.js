const jsmediatags = window.jsmediatags;

async function showFilesInMyLocal() {
  try {
    const fileHandle = await window.showDirectoryPicker();
    document.getElementById("file-access").style.display = "none";
    const fileList = document.getElementById("fileList");
    const audioPlayer = document.getElementById("audioPlayer");

    fileList.innerHTML = ""; // Clear the list
    for await (const entryHandle of fileHandle.values()) {
      if (entryHandle.kind === "file") {
        const file = await entryHandle.getFile();
        const li = document.createElement("li");

        if (file.type.startsWith("audio/")) {
          li.textContent = `${file.name} `;
          const playButton = document.createElement("button");
          playButton.textContent = "Play";
          playButton.onclick = function () {
            jsmediatags.read(file, {
                onSuccess: function(tag) {
                    if (tag.tags.picture) {
                        const picture = tag.tags.picture;
                        let base64String = "";
                        for (let i = 0; i < picture.data.length; i++) {
                            base64String += String.fromCharCode(picture.data[i]);
                        }
                        const base64 = window.btoa(base64String);
                        document.getElementById('albumCover').src = "data:" + picture.format + ";base64," + base64;
                    } else {
                        document.getElementById('albumCover').src = 'default.png';
                    }
                },
                onError: function(error) {
                    console.log('Failed to read metadata: ', error);
                }
            });
            const objectURL = URL.createObjectURL(file);
            audioPlayer.src = objectURL;
            audioPlayer.play();
          };

          li.appendChild(playButton);
        } else {
          li.textContent = `${file.name} (${file.type || "unknown type"})`;
        }

        fileList.appendChild(li);
      } else {
        const li = document.createElement("li");
        li.textContent = `${entryHandle.name} (directory)`;
        fileList.appendChild(li);
      }
    }
  } catch (err) {
    console.error("Error reading the file:", err);
    alert("Failed to read the file.");
  }
}

document.getElementById("file-access").addEventListener("click", async () => {
  console.log("Requesting file system access...");
  showFilesInMyLocal();
});

