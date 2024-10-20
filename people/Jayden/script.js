// Get modal elements
const modal = document.getElementById('qrModal');
const qrImage = document.getElementById('qrImage');
const shareButton = document.getElementById('shareButton');
const closeButton = document.querySelector('.close');

// Show the modal when the share button is clicked
shareButton.onclick = function () {
  modal.style.display = 'block';
};

// Close the modal when the close button is clicked
closeButton.onclick = function () {
  modal.style.display = 'none';
};

// Close the modal if the user clicks outside of the image
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};