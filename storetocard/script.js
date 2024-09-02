function previewImage() {
    const imageUpload = document.getElementById('imageUpload').files[0];
    const imagePreview = document.getElementById('imagePreview');

    if (imageUpload) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(imageUpload);
    }
}

function startEncryption() {
    const imageUpload = document.getElementById('imageUpload').files[0];
    if (!imageUpload) {
        alert('Please upload an image.');
        return;
    }

    // Start the animation of the image sliding out before encryption
    slideImagePreview();

    // Read the image and start the encryption process
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Convert the image to a random bits representation
            const randomBits = convertImageToBits(img);

            // Show the encrypted card with an animation after the slide
            setTimeout(() => showEncryptedCard(randomBits), 2000); // Delay to match slide duration
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(imageUpload);
}

function slideImagePreview() {
    const imagePreview = document.getElementById('imagePreview');
    const shutterSound = document.getElementById('shutterSound');

    // Function to play the shutter sound
    function playShutterSound() {
        shutterSound.currentTime = 0; // Reset the sound to the beginning
        shutterSound.play();
    }

    // Step 1: Flash effect twice with shutter sound (0.15s duration)
    imagePreview.style.transition = 'opacity 0.15s'; // Adjusted flash duration
    imagePreview.style.opacity = 0;
    playShutterSound(); // Play shutter sound for the first flash

    setTimeout(() => {
        imagePreview.style.opacity = 1;

        setTimeout(() => {
            imagePreview.style.opacity = 0;
            playShutterSound(); // Play shutter sound for the second flash

            setTimeout(() => {
                imagePreview.style.opacity = 1;

                // Step 2: Slide to the right after the second flash
                setTimeout(() => {
                    imagePreview.animate([
                        { transform: 'translateX(0px)', opacity: 1 },
                        { transform: 'translateX(200px)', opacity: 0 }
                    ], {
                        duration: 2000,
                        easing: 'ease-in-out'
                    });

                    // Step 3: Fade back to the original position
                    setTimeout(() => {
                        imagePreview.style.transform = 'translateX(0px)';
                        imagePreview.style.opacity = 0;
                        imagePreview.style.display = 'block';
                        imagePreview.animate([
                            { opacity: 0 },
                            { opacity: 1 }
                        ], {
                            duration: 1000,
                            easing: 'ease-in'
                        });

                        // Continue with the remaining animations after fade-in
                        setTimeout(() => {
                            imagePreview.style.opacity = 1; // Ensure it's fully visible
                        }, 1000);

                    }, 2000); // Delay to match slide duration

                }, 150); // Delay to reset opacity after the second flash (150ms)

            }, 150); // Duration between flashes (150ms)

        }, 150); // Duration of first flash (150ms)

    }, 150); // Initial flash duration (150ms)
}


function convertImageToBits(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
    let bits = '';
    
    // Convert image data to random bits for simulation
    for (let i = 0; i < imageData.length; i += 4) {
        bits += Math.random() > 0.5 ? '1' : '0';
        if ((i / 4 + 1) % img.width === 0) bits += '\n';
    }

    return bits;
}

function showEncryptedCard(randomBits) {
    const encryptedCard = document.getElementById('encryptedCard');
    const encryptedDataElement = document.getElementById('encryptedData');
    const fadedImage = document.getElementById('fadedImage');
    const imagePreview = document.getElementById('imagePreview');

    // Limit the encrypted data to 40 lines
    const limitedBits = randomBits.split('\n').slice(0, 12).join('\n');
    
    // Display the encrypted data in the card
    encryptedDataElement.textContent = limitedBits;
    
    // Make the encrypted card slowly appear
    encryptedCard.style.opacity = 1;

    // Set the faded image source to match the uploaded image
    fadedImage.src = imagePreview.src;

    // Set the faded image size and position to match the preview image
    fadedImage.style.width = imagePreview.width + 'px';
    fadedImage.style.height = imagePreview.height + 'px';
    fadedImage.style.top = '50%';
    fadedImage.style.left = '50%';
    fadedImage.style.transform = 'translate(-50%, -50%)';

    // Display the faded image once the card is fully visible
    setTimeout(() => {
        fadedImage.style.display = 'block';
    }, 2000); // Wait for the card to fully appear before showing the faded image
}