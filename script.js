const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerating = false;

const updateImageCard =(imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImages = async (userPrompt, userImgquantity) => {
    try {
          const response = await fetch("https://api.openai.com/v1/images/generations", {
             method: "POST",
             headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
             },
             body: JSON.stringify({
                 prompt: userPrompt,
                 n: parseInt(userImgquantity),
                 size: "512x512",
                 response_format: "b64_json"
             })

          });

         if(!response.ok) throw new Error("failed to generate images! please try again.");

          const { data } = await response.json();
          updateImageCard([...data]);
     }catch (error) {
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;
    
    const userPrompt = e.srcElement[0].value;
    const userImgquantity = e.srcElement[1].value;


    const imgCardMarkup = Array.from({length: userImgquantity}, () =>
        `<div class="img-card loading">
            <img src="loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="download.svg" alt="download icon">
            </a>
        </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgquantity);
}


generateForm.addEventListener("submit", handleFormSubmission);