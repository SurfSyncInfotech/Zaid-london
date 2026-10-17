$(function () {
    const $overlay = $('#modal-overlay');
    const $videoFrame = $('#modal-video-frame');
  
    function openModal(videoUrl) {
        $videoFrame.attr('src', videoUrl + '?autoplay=1');
        $overlay.css('display', 'flex');
    }
  
    function closeModal() {
        $overlay.hide();
        $videoFrame.attr('src', '');
    }
  
    $(document).on('click', '.request-loader', function () {
        var v = $(this).data('video');
        if (v) openModal(v);
    });
  
    $('.modal-close').on('click', closeModal);
  
    $overlay.on('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });
  });  