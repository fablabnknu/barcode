document.addEventListener('DOMContentLoaded', () => {
    const sideLinks = document.getElementById("sideLinks");
    const toggleBtn = document.getElementById("toggleBtn");
    const sideLinksList = document.getElementById("sideLinksList");
    const defaultSchool = "測試學校";
    let currentGroup = 'A';  // 當前顯示的組別 (甲組)

    // 切換側邊欄
    toggleBtn.addEventListener("click", () => {
        sideLinks.classList.toggle("collapsed");
        toggleBtn.textContent = sideLinks.classList.contains("collapsed") ? "顯示老師列表" : "隱藏老師列表";
    });

    // 切換分頁
    document.getElementById('groupATab').addEventListener('click', () => loadGroupData('A'));
    document.getElementById('groupBTab').addEventListener('click', () => loadGroupData('B'));
    document.getElementById('groupCTab').addEventListener('click', () => loadGroupData('C'));

    document.getElementById('backToTop').addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
             top: 0, 
            left: 0,
            behavior: 'smooth'
        });
    });

    // 載入甲組數據預設
    loadGroupData('A');

    function loadGroupData(group) {

        // 獲取內容區域和標題
        const content = document.querySelector('.content');
        const title = document.getElementById('groupTitle');

        // 添加淡出效果
        content.classList.add('fade-out');
        title.classList.add('fade-out');

        // 清除現有的數據
        document.querySelector("#teacherTable tbody").innerHTML = '';
        document.getElementById("sideLinksList").innerHTML = '';
        
        // 根據組別載入相應的數據
        const jsonFile = group === 'A' ? 'groupA.json' : (group === 'B' ? 'groupB.json' : 'groupC.json');
        
        fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                // 更新標題
                const newTitle = group === 'A' ? '甲組、黑客松' : (group === 'B' ? '乙組' : '觀摩');
                title.textContent = `教師名單 (${newTitle})`;

                populateTable(data, group);
                populateSideLinks(data, group);

                // 等待數據加載完成後，添加淡入效果
                setTimeout(() => {
                    content.classList.remove('fade-out');
                    newTitle.classList.remove('fade-out');
                    content.classList.add('fade-in');    
                    newTitle.classList.add('fade-in');
                }, 300);  // 等待100毫秒，以確保過渡效果生效
                
            })
            .catch(error => console.error('Error fetching data:', error))
            
    };



    // 將資料填充到表格中
    function populateTable(data, group) {
    const tbody = document.querySelector("#teacherTable tbody");
    data.forEach((teacher, index) => {
        const a1Barcode = teacher["A1觀摩編號"] ? teacher["A1觀摩編號"].toString() : "null";
        const a2Barcode = teacher["A2競賽編號"] ? teacher["A2競賽編號"].toString() : "null";
        const bHackathonBarcode = teacher["B黑客松編號"] ? teacher["B黑客松編號"].toString() : "null";

        const row = document.createElement("tr");
        row.id = `teacher${group}_${index}`;

        // Check if 備註 is null, if so, keep the cell blank
        const remarkCell = teacher["備註"] !== null ? `<td>${teacher["備註"]}</td>` : `<td></td>`;

        row.innerHTML = `
            ${remarkCell}
            <td>${teacher["恆星位置"]}</td>
            <td>${teacher["學校"] || "測試學校"}</td>
            <td>${teacher["教師姓名"]}</td>
            <td><svg id="barcodeA1_${group}_${index}" class="barcode"></svg></td>
            <td><svg id="barcodeA2_${group}_${index}" class="barcode"></svg></td>
            <td><svg id="barcodeBH_${group}_${index}" class="barcode"></svg></td>
        `;
        tbody.appendChild(row);

        if (a1Barcode === "null") {
            document.getElementById(`barcodeA1_${group}_${index}`).style.display = 'none';
        } else {
            JsBarcode(`#barcodeA1_${group}_${index}`, a1Barcode, {
                format: "CODE128",
                width: 2,
                height: 30
            });
        }

        if (a2Barcode === "null") {
            document.getElementById(`barcodeA2_${group}_${index}`).style.display = 'none';
        } else {
            JsBarcode(`#barcodeA2_${group}_${index}`, a2Barcode, {
                format: "CODE128",
                width: 2,
                height: 30
            });
        }

        if (bHackathonBarcode === "null") {
            document.getElementById(`barcodeBH_${group}_${index}`).style.display = 'none';
        } else {
            JsBarcode(`#barcodeBH_${group}_${index}`, bHackathonBarcode, {
                format: "CODE128",
                width: 2,
                height: 30
            });
        }
    });
}




    // 將資料填充到側邊導航欄
    function populateSideLinks(data, group) {
        const sideLinks = document.getElementById("sideLinksList");
        data.forEach((teacher, index) => {
            const link = document.createElement("a");
            link.textContent = teacher["教師姓名"];
            link.href = `#teacher${group}_${index}`;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(`teacher${group}_${index}`).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'  // 將教師行滾動至畫面中間
                });
            });
            sideLinks.appendChild(link);
        });
    }

    function populateSideLinks(data, group) {
    const sideLinks = document.getElementById("sideLinksList");
    
    // 追蹤當前加粗的教師行
    let lastHighlightedRow = null;
    
    data.forEach((teacher, index) => {
        const link = document.createElement("a");
        link.textContent = teacher["教師姓名"];
        link.href = `#teacher${group}_${index}`;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 滾動至教師位置
            const teacherRow = document.getElementById(`teacher${group}_${index}`);
            teacherRow.scrollIntoView({
                behavior: 'smooth',
                block: 'center'  // 滾動至畫面中間
            });
            
            // 移除之前加粗的行
            if (lastHighlightedRow) {
                lastHighlightedRow.classList.remove('highlighted');
            }
            
            // 加粗當前行
            teacherRow.classList.add('highlighted');
            lastHighlightedRow = teacherRow;
        });
        
        sideLinks.appendChild(link);

        
    });
}
});
