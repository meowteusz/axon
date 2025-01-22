document.getElementById('openai_key').addEventListener('blur', function() {
    document.querySelector('#content pre').textContent = this.value;
  });