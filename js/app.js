function increment() {
    const input = $('#quantity');      // jQuery selector
    input.val(parseInt(input.val()) + 1);  // Use .val() to get and set the value
    console.log(input.val());
}

function decrement() {
    const input = $('#quantity');
    if (parseInt(input.val()) > 0) {
        input.val(parseInt(input.val()) - 1);
        console.log(input.val());
    }
}

    function navigateTo(sectionId) {
    // Hide all sections
    $('section').hide();

    // Show the selected section
    $('#' + sectionId).show();

    // Update URL hash
    window.location.hash = sectionId;
}

    // On page load, navigate to the correct section based on the hash
    $(document).ready(function() {
    const hash = window.location.hash.replace('#', '') || 'customer';
    navigateTo(hash);
});

