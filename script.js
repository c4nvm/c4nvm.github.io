$(document).ready(function() {
    // Switch between tabs
    $('.tab-link').click(function(e) {
        e.preventDefault();
        const targetTab = $(this).attr('href');

        // Remove current class from all tab links and hide all tab contents
        $('.tab-link').removeClass('current');
        $('.tab-content').removeClass('active');

        // Add current class to the clicked tab link and show the corresponding tab content
        $(this).addClass('current');
        $(targetTab).addClass('active');
    });

    // Change color of project links on click
    $('.project a').click(function() {
        $(this).css('color', '#ffca1e');
    });

    // Initialize default positions for projects
    $('.project').each(function() {
        $(this).data('defaultPos', $(this).index() + 1);
    });

    $.fn.resetProject = function() {
        this.removeClass('focus');
        this.find('.projectWrapper').removeClass('blur');
        this.find('img').removeClass('right');
        this.find('div.info').removeClass('blur-bg').removeAttr('style');
        this.insertAfter(`div.project:nth-of-type(${this.data('defaultPos')})`);
    };

    $.fn.focusProject = function(pageX) {
        const focusPos = Math.floor((this.data('defaultPos') - 1) / 4) * 4 + 1;

        this.addClass('focus');

        const img = this.find('img');
        const info = this.find('div.info');

        if (pageX > $(window).width() / 2) {
            img.addClass('right');
            info.css('left', '0');
        }

        info.addClass('blur-bg');
        this.insertBefore(`div.project:nth-of-type(${focusPos})`);
    };

    $.fn.runFocus = function(pageX) {
        if (window.matchMedia('(min-aspect-ratio: 2/3)').matches) {
            if (this.hasClass('focus')) {
                this.resetProject();
            } else {
                $('.project').each(function() {
                    $(this).resetProject();
                });
                this.focusProject(pageX);
            }

            const midPoint = this.find('img').offset().top - ($(window).height() / 2 - this.find('img').height() / 2);
            $('html, body').animate({ scrollTop: midPoint }, 1);
        }
    };

    $(window).resize(function() {
        if (window.matchMedia('(max-aspect-ratio: 2/3)').matches) {
            $('.project').each(function() {
                $(this).resetProject();
            });
        }
    });

    $('.project img').on('click', function(e) {
        $(this).parent().runFocus(e.pageX);
    });
    
    $('#search-input').on('input', function() {
        const searchQuery = $(this).val().toLowerCase();
        // Filter articles based on the search query and update the display
        // (You'll need to implement this part based on your data structure)
    });

    $('.tag').click(function(e) {
        e.preventDefault();
        const selectedTag = $(this).text(); // Get the tag text
        // Filter articles based on the selected tag and update the display
        // (Again, customize this part according to your data)
    });

    // Handle form submission to Google Sheets
        $('#contact-form').on('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission
    
            const formData = new FormData(this);
            const url = 'https://script.google.com/macros/s/AKfycbykioMhIKq-K3YF0H9p5GKU9z7q9DZkOKyg8mfG9WHGHPIcSghUX7Q9Xs4yxFbR5E7I/exec'; // Replace with your Web App URL
    
            // Convert FormData to URLSearchParams
            const urlParams = new URLSearchParams();
            formData.forEach((value, key) => {
                urlParams.append(key, value);
            });
    
            fetch(url, {
              method: 'POST',
              mode: 'cors',  // Ensure CORS mode is set
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: urlParams.toString()
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              if (data.result === 'success') {
                $('#response-message').removeClass('hidden');
                $('#contact-form').trigger('reset');
              } else {
                alert('There was a problem with your submission: ' + data.error);
              }
            })
            .catch(error => {
              alert('There was an error: ' + error.message);
              console.error('Fetch error:', error); // Log error details for debugging
            });
        });
    });
    
// Function to detect mobile devices
    function isMobileDevice() {
        return window.matchMedia("(max-width: 767px)").matches;
    }
    
    window.addEventListener("orientationchange", function() {
        if (isMobileDevice()) {
        if (window.orientation === 90 || window.orientation === -90) {
            // Landscape on mobile
            document.body.style.display = "none";
            document.getElementById("rotateMessage").style.display = "block";
        } else {
            // Portrait on mobile
            document.body.style.display = "block";
            document.getElementById("rotateMessage").style.display = "none";
        }
        }
    });
    