(function ($) {

    // =========================
    // APPOINTMENT FORM
    // =========================
    function initAppointmentSubmit() {
        $(document).on('submit', '#appointment-form', function (e) {
            e.preventDefault();

            var $form = $(this);
            var isValid = true;

            // reset message
            $form.prevAll('.form-message').addClass('hidden');
            $form.find('.error-text').addClass('hidden');

            // required fields
            var requiredFields = [
                '#first-name',
                '#last-name',
                '#telephone',
                '#treatment' // hidden input
            ];

            $.each(requiredFields, function (i, selector) {
                var $field = $form.find(selector);

                if ($.trim($field.val()) === '') {
                    isValid = false;
                    $field
                        .closest('div')
                        .find('.error-text')
                        .removeClass('hidden');
                }
            });

            if (isValid) {
                $form.prevAll('.form-message.success').removeClass('hidden');
                // $form[0].reset(); // optional
            } else {
                $form.prevAll('.form-message.error').removeClass('hidden');
            }
        });
    }

    // =========================
    // CONTACT FORM
    // =========================
    function initContactSubmit() {
        $(document).on('submit', '#contact-form', function (e) {
            e.preventDefault();

            var $form = $(this);
            var isValid = true;

            // reset message
            $form.prevAll('.form-message').addClass('hidden');
            $form.find('.error-text').addClass('hidden');

            // required fields
            var requiredFields = [
                '#first-name',
                '#last-name',
                '#email',
                '#phone'
            ];

            $.each(requiredFields, function (i, selector) {
                var $field = $form.find(selector);

                if ($.trim($field.val()) === '') {
                    isValid = false;
                    $field
                        .closest('.form-input-wrapper')
                        .find('.error-text')
                        .removeClass('hidden');
                }
            });

            if (isValid) {
                $form.prevAll('.form-message.success').removeClass('hidden');
                // $form[0].reset(); // optional
            } else {
                $form.prevAll('.form-message.error').removeClass('hidden');
            }
        });
    }

    // INIT
    $(document).ready(function () {
        initAppointmentSubmit();
        initContactSubmit();
    });

})(jQuery);