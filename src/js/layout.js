import viewport from './viewport'

export default function () {
    if (viewport().width < 360) {
        let mvp = document.getElementById('vp');
        mvp.setAttribute('content', 'user-scalable=no,width=360');
    }

    setTimeout(function () {
        document.body.classList.add('doc-ready');
    }, 100);

    window.addEventListener('load', function (ev) {
        document.body.classList.add('doc-ready', 'window-loaded');
    });

}
