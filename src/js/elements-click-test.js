export default function () {

    let container = document.getElementById('element-click-test');

    function createItem(number, parent) {
        let item = document.createElement("div");
        item.classList.add('item');
        item.innerText = 'Element ' + (number + 1);
        parent.append(item);
    }

    function makeSomething(item) {
        item.classList.toggle('selected');
    }

    if (container) {
        for (let i = 0; i < 1000; i++) {
            createItem(i, container)
        }

        container.addEventListener('click', function (event) {
            let target = event.target;
            if (!target.classList.contains('item')) return;
            makeSomething(target);
        });
    }


}