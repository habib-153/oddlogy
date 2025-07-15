// disappearing banner
function banruBannerDelete() {
    var x = document.getElementById("banruBanner");
    var button = document.getElementById("banruBannerButton");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    button.style.display = "none";
  }


  // for testimonial image shuffle 
  $(document).ready(function () {

    $('.client-single').on('click', function (event) {
       event.preventDefault();

       var active = $(this).hasClass('active');

       var parent = $(this).parents('.testi-wrap');

       if (!active) {
           var activeBlock = parent.find('.client-single.active');

           var currentPos = $(this).attr('data-position');

           var newPos = activeBlock.attr('data-position');

           activeBlock.removeClass('active').removeClass(newPos).addClass('inactive').addClass(currentPos);
           activeBlock.attr('data-position', currentPos);

           $(this).addClass('active').removeClass('inactive').removeClass(currentPos).addClass(newPos);
           $(this).attr('data-position', newPos);

       }
   });

}(jQuery));


// back to top button
var btn = $('#button');

$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});

if ($(window).scrollTop() > 100) {
  btn.addClass('show');
}


// send email
const googleScriptURL = "https://script.google.com/macros/s/AKfycbyd-1d4rYE3NNIcuoUN6pNGUmLZLS7y6Is4Ba3EeBoSNahNEwVXhV_TLkwd6M638jH7/exec"; // Replace this with your actual Web App URL

function sendEmailAndClose() {
  const emailInput = document.getElementById('emailInput').value;
  const errorText = document.getElementById('errorText');

  // Check if the email input is empty
  if (!emailInput) {
    errorText.style.display = 'block'; // Show error message
    return; // Prevent modal from closing
  }

  // Hide error message if email is provided
  errorText.style.display = 'none';

  // Prepare data to send
  const formData = new FormData();
  formData.append("email", emailInput);

  // Send email to Google Sheet
  fetch(googleScriptURL, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    console.log("Email sent to Google Sheet:", emailInput);
  })
  .catch(error => console.error("Error sending email:", error));

  // Close the modal
  $('#exampleModalCenter').modal('hide');
}



  /*
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Disable certain key combinations
  document.addEventListener("keydown", function (e) {
    // Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, F12
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U') || // Ctrl+U
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        e.key === 'F12') { // F12
      e.preventDefault();
    }
  });
  */