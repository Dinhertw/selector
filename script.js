
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-VFCKQ15FEE');


	
	
	// 统一 SweetAlert2 按钮样式
const blueSwal = Swal.mixin({
    buttonsStyling: false, // 禁用默认样式
    customClass: {
        confirmButton: 'swal2-blue-button', // 蓝色确认按钮样式
        cancelButton: 'swal2-cancel-button', // 红色取消按钮样式
        actions: 'swal2-actions-horizontal', // 横向排列
		htmlContainer: 'modal-body',
		popup: 'modal-content generating-modal-content',
        htmlContainer: 'modal-body',
    }
});




    // Functions for custom select dropdowns
    function showDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        dropdown.style.display = "block";
    }

    function hideDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        dropdown.style.display = "none";
    }

function setupCustomSelect(inputId, dropdownId, fetchOptions) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    let start = 0;
    const limit = 50; // 每次載入的選項數
    let loading = false;
    let hasMoreOptions = true;

    function loadOptions() {
        if (loading || !hasMoreOptions) return;
        loading = true;

        fetchOptions(start, limit).then(options => {
            if (options.length < limit) {
                hasMoreOptions = false; // 如果載入的選項數少於 limit，表示沒有更多選項了
            }

            options.forEach(option => {
                const div = document.createElement("div");
                div.textContent = option;

                div.addEventListener("click", () => {
                    const prevValue = input.value;
                    if (prevValue === option) {
                        // 值未改變，不需要處理
                        hideDropdown(dropdownId);
                        return;
                    }

                    input.value = option;
                    hideDropdown(dropdownId);

                    // 手動調用 handleRangeChange 函數
                    handleRangeChange(input, prevValue);
                });

                dropdown.appendChild(div);
            });

            start += limit;
            loading = false;

            // 監聽滾動事件來載入更多
            dropdown.addEventListener('scroll', onScroll);
        });
    }

    function onScroll() {
        const dropdownScrollTop = dropdown.scrollTop;
        const dropdownScrollHeight = dropdown.scrollHeight;
        const dropdownClientHeight = dropdown.clientHeight;

        // 如果滾動到底部，載入更多選項
        if (dropdownScrollTop + dropdownClientHeight >= dropdownScrollHeight - 250) {
            loadOptions();
        }
    }

    input.addEventListener("focus", () => {
        showDropdown(dropdownId);
        loadOptions(); // 載入初始選項
    });

    input.addEventListener("blur", () => {
        setTimeout(() => hideDropdown(dropdownId), 250);
    });

    // 監聽滾動事件來載入更多
    dropdown.addEventListener('scroll', onScroll);
}


// 類比一個從伺服器或其他源獲取選項的函數
function fetchOptions(start, limit) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 生成類比資料
            const options = Array.from({ length: limit }, (_, i) => start + i + 1);
            resolve(options);
        }); 
    });
}

// 初始化自訂選擇下拉式功能表
setupCustomSelect("numPeopleInput", "numPeopleOptions", (start, limit) => fetchOptions(start, limit, 'numPeople'));
setupCustomSelect("minRangeInput", "minRangeOptions", (start, limit) => fetchOptions(start, limit, 'range'));
setupCustomSelect("maxRangeInput", "maxRangeOptions", (start, limit) => fetchOptions(start, limit, 'range'));




    let history = [];
    let selectedNumbers = new Set();
    let minRange = 0;
    let maxRange = 0;
    let numPeople = 0;
    let interval; // 用於存儲動畫效果的Interval

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }

    function loadFromCookies() {
        const savedHistory = getCookie("history");
        const savedSelectedNumbers = getCookie("selectedNumbers");
        minRange = parseInt(getCookie("minRange"));
        maxRange = parseInt(getCookie("maxRange"));
        numPeople = parseInt(getCookie("numPeople"));

        if (savedHistory) {
            history = JSON.parse(savedHistory);
            updateHistory(document.getElementById('historyList'));
        }

        if (savedSelectedNumbers) {
            selectedNumbers = new Set(JSON.parse(savedSelectedNumbers));
        }

        if (!isNaN(minRange)) {
            document.getElementById('minRangeInput').value = minRange; // 更新為正確的id
        }

        if (!isNaN(maxRange)) {
            document.getElementById('maxRangeInput').value = maxRange; // 更新為正確的id
        }

        if (!isNaN(numPeople)) {
            document.getElementById('numPeopleInput').value = numPeople; // 更新為正確的id
        }
    }

    function saveToCookies() {
        setCookie("history", JSON.stringify(history), 30);
        setCookie("selectedNumbers", JSON.stringify(Array.from(selectedNumbers)), 30);
        setCookie("minRange", minRange, 30);
        setCookie("maxRange", maxRange, 30);
        setCookie("numPeople", numPeople, 30);
    }

function generateNumbers() {
    numPeople = parseInt(document.getElementById('numPeopleInput').value);
    minRange = parseInt(document.getElementById('minRangeInput').value);
    maxRange = parseInt(document.getElementById('maxRangeInput').value);
    const allowDuplicates = document.getElementById('allowDuplicates').checked;
    const resultsList = document.getElementById('resultsList');
    const historyList = document.getElementById('historyList');

    resultsList.innerHTML = '';

    // 驗證輸入
    if (isNaN(numPeople) || numPeople <= 0) {
        blueSwal.fire({
            icon: 'error',
            title: '請輸入有效的選擇人數',
            confirmButtonText: '確認',	
        });
        return;
    }

    if (isNaN(minRange) || isNaN(maxRange) || minRange >= maxRange) {
        blueSwal.fire({
            icon: 'error',
            title: '請輸入有效的號碼範圍',
            confirmButtonText: '確認',
        });
        return;
    }

    if ((maxRange - minRange + 1) < numPeople) {
        blueSwal.fire({
            icon: 'error',
            title: '號碼範圍不夠選擇人數，請更改選擇人數或號碼範圍',
            confirmButtonText: '確認',
        });
        return;
    }

    if (!allowDuplicates && (selectedNumbers.size + numPeople > (maxRange - minRange + 1))) {
        blueSwal.fire({
            icon: 'error',
            title: '所有號碼已選完，請清除歷史記錄',
            confirmButtonText: '確認',
        });
        return;
    }

    // 使用 blueSwal.fire 顯示生成過程
    blueSwal.fire({
        title: '讓我們掌聲歡迎.....',
        html: '<div class="loading"></div>',
        allowOutsideClick: false,
        showConfirmButton: false,
        customClass: {
            popup: 'modal-content generating-modal-content',
            title: 'modal-header',
            htmlContainer: 'modal-body',
        },
        didOpen: () => {
            let count = 0;
            interval = setInterval(() => {
                const randomNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
                const loadingText = Swal.getHtmlContainer().querySelector('.loading');
                loadingText.textContent = randomNumber;
                count++;

                if (count >= 25) {
                    clearInterval(interval);
                    Swal.close();

                    const selected = new Set();

                    while (selected.size < numPeople) {
                        const randomNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
                        if (allowDuplicates || !selectedNumbers.has(randomNumber)) {
                            selected.add(randomNumber);
                            if (!allowDuplicates) {
                                selectedNumbers.add(randomNumber);
                            }
                        }
                    }

                    if (selected.size === numPeople) {
                        if (!allowDuplicates) {
                            history.push(Array.from(selected));
                            saveToCookies();
                        }
                        updateHistory(historyList);
                        openResultModal(selected);
                    }
                }
            }, 50);
        }
    });
}





function openResultModal(selected) {
    blueSwal.fire({
        title: '恭喜恭喜',
        html: `<div id="resultList">${Array.from(selected)
            .map(num => `<div class="result-number">${num}</div>`)
            .join('')}</div>`,
        confirmButtonText: '確認',
        customClass: {
            popup: 'modal-content generating-modal-content',
            title: 'modal-header',
            htmlContainer: 'modal-body',
			actions: 'swal2-actions-horizontal',
        },
    });
}


    
    



    function showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function clearErrorMessage() {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.style.display = 'none';
    }

    function updateHistory(historyList) {
        historyList.innerHTML = '';
        history.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.textContent = `${item.join(', ')}`;
            historyList.appendChild(li);
        });

        // 使用 requestAnimationFrame 確保在渲染後滾動到頂部
        requestAnimationFrame(() => {
        historyList.scrollTop = historyList.scrollHeight;
        });
    }

	
    function clearHistory() {
        history = [];
        selectedNumbers.clear();
        document.getElementById('historyList').innerHTML = '';
        setCookie("history", "", -1);
        setCookie("selectedNumbers", "", -1);
        document.getElementById('generateButton').disabled = false;
			blueSwal.fire({
				timer: 1000,
				timerProgressBar: true,
				icon: "success",
				confirmButtonText: '確認',
				title: "已清除歷史記錄"
			});

    }

window.onload = () => {
    loadFromCookies();
    document.getElementById('generateButton').addEventListener('click', generateNumbers);

    // 監聽"重複選號(不會記錄)"選項更改
    document.getElementById('allowDuplicates').addEventListener('change', () => {
        if (history.length > 0) {
            blueSwal.fire({
                title: '開啟重複選號功能，歷史記錄將被清除，確定要繼續嗎？',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '確認',
                cancelButtonText: '取消',
            }).then((result) => {
                if (result.isConfirmed) {
                    clearHistory(); // 清除歷史記錄
                    clearErrorMessage(); // 清除錯誤訊息
                } else {
                    // 恢復選項狀態
                    document.getElementById('allowDuplicates').checked = !document.getElementById('allowDuplicates').checked;
                }
            });
        } else {
            clearErrorMessage();
        }
    });

    // 保存輸入框的前一個值
    let minPrevValue = document.getElementById('minRangeInput').value;
    let maxPrevValue = document.getElementById('maxRangeInput').value;

    const minRangeInput = document.getElementById('minRangeInput');
    const maxRangeInput = document.getElementById('maxRangeInput');

    // 監聽輸入框的 focus 事件，保存當前值
    minRangeInput.addEventListener('focus', () => {
        minPrevValue = minRangeInput.value;
    });

    maxRangeInput.addEventListener('focus', () => {
        maxPrevValue = maxRangeInput.value;
    });

    // 監聽輸入框的 change 事件
    minRangeInput.addEventListener('change', () => {
        handleRangeChange(minRangeInput, minPrevValue);
    });

    maxRangeInput.addEventListener('change', () => {
        handleRangeChange(maxRangeInput, maxPrevValue);
    });
};


function handleRangeChange(inputElement, prevValue) {
    if (inputElement.value === prevValue) {
        // 值未改變，不需要處理
        return;
    }

    if (history.length > 0) {
	blueSwal.fire({
		title: '更改號碼範圍，歷史記錄將被清除，確定要繼續嗎？',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: '確認',
		cancelButtonText: '取消',
	}).then((result) => {
		if (result.isConfirmed) {
			clearHistory();
			clearErrorMessage();
			// 更新 prevValue
			if (inputElement === minRangeInput) {
				minPrevValue = inputElement.value;
			} else {
				maxPrevValue = inputElement.value;
			}
    } else {
        // 恢復輸入框的值
        inputElement.value = prevValue;
    }
});

    } else {
        // 更新 prevValue
        if (inputElement === minRangeInput) {
            minPrevValue = inputElement.value;
        } else {
            maxPrevValue = inputElement.value;
        }
        clearErrorMessage();
    }
}



function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = 1 / 1;

    if (width / height > aspectRatio) {
        document.querySelector('.scale-container').style.transform = `scale(${height / 700})`;
    } else {
        document.querySelector('.scale-container').style.transform = `scale(${width / 800})`;
    }
}

window.addEventListener('resize', resize);
resize();  // 初始載入時調用一次


    
