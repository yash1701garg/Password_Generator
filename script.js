
document.addEventListener('DOMContentLoaded', () => {
    const inputSlider = document.querySelector("[data-length-slider]");
    const lengthDisplay = document.querySelector("[data-lengthNumber]");
    const passwordDisplay = document.querySelector("[data-passwordDisplay]");
    const copyBtn = document.querySelector("[data-copy]");
    const copyMsg = document.querySelector("[data-copyMsg]");
    const uppercaseCheck = document.querySelector("#uppercase");
    const lowercaseCheck = document.querySelector("#lowercase");
    const numbersCheck = document.querySelector("#numbers");
    const symbolsCheck = document.querySelector("#symbols");
    const indicator = document.querySelector("[data-indicator]");
    const generateBtn = document.querySelector(".generateButton");
    const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");
    
    const symbols = '~!@#$%^&*()_+={[}]:;"<,>.?/';
    
    let password = "";
    let passwordLength = 10;
    let checkCount = 0;
    
    handleSlider();
    setIndicator("#ccc");
    
    function handleSlider() {
        inputSlider.value = passwordLength;
        lengthDisplay.innerText = passwordLength;
    }
    
    function setIndicator(color) {
        indicator.style.backgroundColor = color;
        //shadow->apply
    }
    
    function getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function generateRandomNumber() {
        return getRandomInteger(0, 9);
    }
    
    function generateLowerCase() {
        return String.fromCharCode(getRandomInteger(97, 122));
    }
    
    function generateUpperCase() {
        return String.fromCharCode(getRandomInteger(65, 90));
    }
    
    function generateSymbol() {
        const randomIndex = getRandomInteger(0, symbols.length - 1);
        return symbols[randomIndex];
    }
    
    function calculateStrength() {
        const hasUpper = uppercaseCheck.checked;
        const hasLower = lowercaseCheck.checked;
        const hasNum = numbersCheck.checked;
        const hasSym = symbolsCheck.checked;
        
        if (hasUpper && hasLower && hasNum && hasSym && passwordLength >= 8) {
            setIndicator("#0f0");
        } else if ((hasLower || hasUpper) && (hasSym || hasNum) && passwordLength >= 6) {
            setIndicator("#ff0");
        } else {
            setIndicator("#f00");
        }
    }
    
    async function copyContent() {
        try {
            //promise return 
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyMsg.innerText = "Copied";
        } catch (err) {
            console.error("Failed to copy:", err);
            copyMsg.innerText = "Failed";
        }
        
        copyMsg.classList.add("active");
        setTimeout(() => {
            copyMsg.classList.remove("active");
        }, 2000);
    }
    
    function shufflePassword(passwordArray) {
        //fisher yield method
        for (let i = passwordArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
        }
        return passwordArray.join("");
    }
    
    function handleCheckboxChange() {
        checkCount = Array.from(allCheckBoxes).filter(checkbox => checkbox.checked).length;
        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }
        calculateStrength();
    }
    
    allCheckBoxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
    
    inputSlider.addEventListener('input', (e) => {
        passwordLength = parseInt(e.target.value);
        handleSlider();
        calculateStrength();
    });
    
    copyBtn.addEventListener('click', () => {
        if (passwordDisplay.value) {
            copyContent();
        }
    });
    
    generateBtn.addEventListener('click', () => {
        if (checkCount <= 0) return;
        
        password = "";
        
        const selectedFunctions = [];
        if (uppercaseCheck.checked) selectedFunctions.push(generateUpperCase);
        if (lowercaseCheck.checked) selectedFunctions.push(generateLowerCase);
        if (numbersCheck.checked) selectedFunctions.push(generateRandomNumber);
        if (symbolsCheck.checked) selectedFunctions.push(generateSymbol);
        
        for (let i = 0; i < passwordLength; i++) {
            const randomFunction = selectedFunctions[Math.floor(Math.random() * selectedFunctions.length)];
            password += randomFunction();
        }
        
        password = shufflePassword(password.split(""));
        passwordDisplay.value = password;
        calculateStrength();
    });
});
