document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const showResultsButton = document.getElementById('show-results');
    const warningMessage = document.getElementById('warning-message');
    const resultsContainer = document.getElementById('results');
    const questionButtons = document.querySelectorAll('.question-button');

    let currentSlideIndex = 0;
    const answers = Array.from({ length: slides.length }, () => []);

    function getRandomAnswers(totalAnswers) {
        const allAnswers = Array.from({ length: totalAnswers }, (_, i) => i + 1);
        const shuffled = allAnswers.sort(() => Math.random() - 0.5);
        const numberOfAnswers = Math.floor(Math.random() * 7) + 2; // Random broj između 2 i 8
        return shuffled.slice(0, numberOfAnswers);
    }

    function updateNavigation() {
        prevButton.style.display = currentSlideIndex === 0 ? 'none' : 'inline';
        nextButton.style.display = currentSlideIndex === slides.length - 1 ? 'none' : 'inline';
        updateShowResultsButton();
        updateProgressBar();
    }

    function updateShowResultsButton() {
        const allAnswered = answers.every(answer => answer.length > 0);
        showResultsButton.style.display = allAnswered ? 'inline' : 'none';
        showResultsButton.disabled = !allAnswered; // Iskljuci gumb ako sva pitanja nisu odgovorena
    }

    function updateProgressBar() {
        questionButtons.forEach((btn, index) => {
            if (answers[index].length > 0) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function displayWarning(message) {
        warningMessage.textContent = message;
        warningMessage.style.display = 'block';
        setTimeout(() => {
            warningMessage.style.display = 'none';
        }, 3000);
    }

    function showResults() {
        resultsContainer.innerHTML = '';
        answers.forEach((answer, index) => {
            resultsContainer.innerHTML += `Pitanje ${index + 1}: ${answer.join(', ')}<br>`;
        });
    }

    slides.forEach((slide, index) => {
        const answerElements = slide.querySelectorAll('.answer');

        // Generiraj pitanja nasumično i prikaži ih
        const randomAnswers = getRandomAnswers(8);
        answerElements.forEach(answer => {
            const answerValue = parseInt(answer.dataset.answerValue);
            if (randomAnswers.includes(answerValue)) {
                answer.style.display = 'block'; 
            } else {
                answer.style.display = 'none'; 
            }
        });

        answerElements.forEach(answer => {
            answer.addEventListener('click', () => {
                const answerValue = answer.dataset.answerValue;
                const isSelected = answers[index].includes(answerValue);

                // Odabir selekcije
                if (isSelected) {
                    answers[index] = answers[index].filter(value => value !== answerValue);
                    answer.classList.remove('selected');
                } else {
                    if (answers[index].length < index + 3) {
                        answers[index].push(answerValue);
                        answer.classList.add('selected');
                    } else {
                        displayWarning(`Odabrali ste previše odgovora!`);
                    }
                }
                updateShowResultsButton(); 
            });
        });
    });

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        updateNavigation();
    }

    prevButton.addEventListener('click', () => {
        currentSlideIndex--;
        showSlide(currentSlideIndex);
    });

    nextButton.addEventListener('click', () => {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    });

    questionButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            currentSlideIndex = index;
            showSlide(currentSlideIndex);
        });
    });

    showResultsButton.addEventListener('click', showResults);

    showSlide(currentSlideIndex);
});