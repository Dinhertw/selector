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
                hasMoreOptions = true; // 如果載入的選項數少於limit，表示沒有更多選項了
            }

            options.forEach(option => {
                const div = document.createElement("div");
                div.textContent = option;
                div.addEventListener("click", () => {
                    input.value = option;
                    hideDropdown(dropdownId);
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
    const errorMessage = document.getElementById('errorMessage');
    const generatingModal = document.getElementById('generatingModal');

    resultsList.innerHTML = '';

    // 檢查選擇人數是否有效
    if (isNaN(numPeople) || numPeople <= 0) {
		Swal.fire({
			icon: 'error',
			title: '請輸入有效的選擇人數',
			text: '',
			timer: 3000,
			timerProgressBar: true,
			confirmButtonText: '確認'
		});
        return;
    }

    // 檢查其他條件
    if (isNaN(minRange) || isNaN(maxRange) || minRange >= maxRange) {
			Swal.fire({
			icon: 'error',
			title: '請輸入有效的號碼範圍',
			text: '',
			timer: 3000,
			timerProgressBar: true,
			confirmButtonText: '確認'
		});
        return;
    }

    if ((maxRange - minRange + 1) < numPeople) {
			Swal.fire({
				icon: 'error',
				title: '號碼範圍不夠選擇人數，請更改選擇人數或號碼範圍',
				text: '',
				timer: 3000,
				timerProgressBar: true,
				confirmButtonText: '確認'
			});
        return;
    }

    if (!allowDuplicates && (selectedNumbers.size + numPeople > (maxRange - minRange + 1))) {
			Swal.fire({
				icon: 'error',
				title: '所有號碼已選完，請清除歷史記錄',
				text: '',
				timer: 3000,
				timerProgressBar: true,
				confirmButtonText: '確認'
			});
                
        return;
    }

    generatingModal.style.display = 'block';
    errorMessage.style.display = 'none';
    openGeneratingModal();

    let count = 0;
    interval = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
        const loadingText = document.querySelector('.loading');
        loadingText.textContent = randomNumber;
        count++;

        if (count >= 20) {
            clearInterval(interval);
            closeGeneratingModal();
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
    }, 75);
}





    function openGeneratingModal() {
        const generatingModal = document.getElementById('generatingModal');
        generatingModal.style.display = 'block';
        

        
    }

    function closeGeneratingModal() {
        const generatingModal = document.getElementById('generatingModal');
        generatingModal.style.display = 'none';
    }

function openResultModal(selected) {
    const resultList = document.getElementById('resultList'); 
    resultList.innerHTML = Array.from(selected).map(num => `<div class="result-number">${num}</div>`).join('');
    const resultModal = document.getElementById('resultModal');
    resultModal.style.display = 'block';

    // 函數用於滾動到頂部
    function scrollToTop() {
        if (resultList) {
            resultList.scrollTop = 0;
        }
    }

    // 直接調用 scrollToTop 函數
    scrollToTop();
}

    
    

    function closeResultModal() {
        const resultModal = document.getElementById('resultModal');
        resultModal.style.display = 'none';
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

    function clearHistory1() {
        history = [];
        selectedNumbers.clear();
        document.getElementById('historyList').innerHTML = '';
        setCookie("history", "", -1);
        setCookie("selectedNumbers", "", -1);
        document.getElementById('generateButton').disabled = false;
			Swal.fire({
				icon: 'success',
				title: '已清除歷史記錄',
				text: '',
				timer: 1000,
				timerProgressBar: true,
				confirmButtonText: '確認'
			});
    }
	
    function clearHistory() {
        history = [];
        selectedNumbers.clear();
        document.getElementById('historyList').innerHTML = '';
        setCookie("history", "", -1);
        setCookie("selectedNumbers", "", -1);
        document.getElementById('generateButton').disabled = false;

    }

window.onload = () => {
    loadFromCookies();
    document.getElementById('generateButton').addEventListener('click', generateNumbers);

    // 監聽"重複選號(不會記錄)"選項更改
    document.getElementById('allowDuplicates').addEventListener('change', () => {
        clearHistory(); // 清除歷史記錄
        clearErrorMessage(); // 清除錯誤訊息
    });

    // 監聽號碼範圍輸入框的更改
    document.getElementById('minRangeInput').addEventListener('change', () => {
        clearHistory(); // 清除歷史記錄
        clearErrorMessage(); // 清除錯誤訊息
    });

    document.getElementById('maxRangeInput').addEventListener('change', () => {
        clearHistory(); // 清除歷史記錄
        clearErrorMessage(); // 清除錯誤訊息
    });
        document.getElementById('minRangeOptions').addEventListener('click', () => {
        clearHistory(); // 清除歷史記錄
        clearErrorMessage(); // 清除錯誤訊息
    });

    document.getElementById('maxRangeOptions').addEventListener('click', () => {
        clearHistory(); // 清除歷史記錄
        clearErrorMessage(); // 清除錯誤訊息
    });
};


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
resize();  // 初始加載時調用一次





function closeResultModal() {
    const resultModal = document.getElementById('resultModal');
    
    // Remove the background color by setting it to transparent
    resultModal.style.backgroundColor = 'transparent';

    // Wait a short time before starting the close animation
    setTimeout(() => {
        // Add the closing class to trigger the content animation
        resultModal.classList.add('closing');

        // Hide the modal after the close animation completes
        setTimeout(() => {
            resultModal.style.display = 'none';
            resultModal.classList.remove('closing'); // Reset for future openings
            resultModal.style.backgroundColor = ''; // Restore background color
        }, 75); // Duration of the close animation
    }, 100); // Delay to let background fade out before scaling content
}
// Function to close the result modal with animation
function closeResultModal() {
    const resultModal = document.getElementById('resultModal');
    
    // Remove the background color first
    resultModal.style.backgroundColor = 'transparent';

    // Start the close animation after a short delay
    setTimeout(() => {
        resultModal.classList.add('closing');

        // Hide the modal after the animation completes
        setTimeout(() => {
            resultModal.style.display = 'none';
            resultModal.classList.remove('closing'); // Reset class for future use
            resultModal.style.backgroundColor = ''; // Restore background color
        }, 200); // Duration of the close animation
    }, 100); // Delay for background fade-out
}

// Close modal when clicking outside the modal content
document.getElementById('resultModal').addEventListener('click', function (event) {
    const modalContent = document.querySelector('#resultModal .modal-content');
    if (!modalContent.contains(event.target)) {
        closeResultModal(); // Close modal if click is outside the modal content
    }
});

