export default function () {

    let scrollTable = document.getElementsByClassName('scrollable-table');

    function initTable() {
        Array.from(scrollTable).forEach(function (table) {
            let tableRows = table.getElementsByTagName('tr');

            Array.from(tableRows).forEach(function (row, rowIndex) {
                let leftFixedCols = Array.from(row.getElementsByClassName('fixed-left'));

                leftFixedCols.forEach(function (col, index) {
                    if (index !== 0) {

                        let cellWidth = leftFixedCols[index - 1].getBoundingClientRect().width;
                        let cellLeft = leftFixedCols[index - 1].getBoundingClientRect().left - table.getBoundingClientRect().x - 1;

                        col.style.left = (cellLeft + cellWidth) + 'px';
                    }
                });

                let topFixedCols = Array.from(row.getElementsByClassName('fixed-top'));

                topFixedCols.forEach(function (col, index) {
                    let cellTop = row.getBoundingClientRect().top - table.getBoundingClientRect().top - 1;
                    col.style.top = cellTop + 'px';
                });

            });
        });
    }

    window.addEventListener('load', initTable);


    let scrollTable2 = document.getElementsByClassName('scrollable-table2')[0];
    let scrollTable2Wrap = document.getElementsByClassName('scrollable-table2__wrap')[0];

    function initTable2() {
        if (scrollTable2) {
            let scrollTable2FixedCell = scrollTable2.getElementsByClassName('fixed-cell');

            Array.from(scrollTable2FixedCell).forEach(function (cell) {
                let cellCont = cell.innerHTML;
                let clone = document.createElement("div");
                clone.classList.add('cloned-cell');
                let cellStyle = {
                    top: cell.getBoundingClientRect().top - scrollTable2.getBoundingClientRect().top + 'px',
                    left: cell.getBoundingClientRect().left - scrollTable2.getBoundingClientRect().left + 'px',
                    width: (cell.getBoundingClientRect().width + 1) + 'px',
                    height: (cell.getBoundingClientRect().height + 1) + 'px'
                };
                Object.assign(clone.style, cellStyle);

                clone.innerHTML = cellCont;
                cell.append(clone);
            });

            let scrollTable2FixedScrollX = document.querySelectorAll('.scroll-x .cloned-cell');

            let scrollTable2FixedScrollY = document.querySelectorAll('.scroll-y .cloned-cell');

            scrollTable2Wrap.addEventListener("scroll", function (event) {
                let leftPos = this.scrollLeft;
                let topPos = this.scrollTop;

                scrollTable2FixedScrollX.forEach(function (item) {
                    item.style.transform = 'translateX(-' + leftPos + 'px)';
                });

                scrollTable2FixedScrollY.forEach(function (item) {
                    item.style.transform = 'translateY(-' + topPos + 'px)';
                });
            });
        }
    }

    window.addEventListener('load', initTable2);

}
