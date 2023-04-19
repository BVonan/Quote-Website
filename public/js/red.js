function validateKeyword() {
    const keywordInput = document.getElementById("keyword");
    const errorMsg = document.getElementById("error-msg");
    if (keywordInput.value.length < 3) {
      errorMsg.textContent = "Keyword must be at least 3 characters long";
      return false;
    }
    return true;
  }