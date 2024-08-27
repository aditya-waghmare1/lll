async function generateContent() {
    const prompt = document.getElementById("prompt").value;
    const response = await fetch("/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
    });
    const result = await response.json();
    document.getElementById("output").innerText = result.text || "No text generated.";
}

async function detectImage() {
    const imageInput = document.getElementById("imageInput").files[0];
    const formData = new FormData();
    formData.append("image", imageInput);

    const response = await fetch("/detect-image", {
        method: "POST",
        body: formData
    });
    const result = await response.json();
    document.getElementById("output").innerText = result.detectedText || "No text detected from image.";
}
