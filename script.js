document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultDiv = document.getElementById('result');
    const password1Input = document.getElementById('password1');
    const password2Input = document.getElementById('password2');
    const matchScoreInput = document.getElementById('matchScore');
    const mismatchScoreInput = document.getElementById('mismatchScore');
    const gapPenaltyInput = document.getElementById('gapPenalty');

    analyzeBtn.addEventListener('click', () => {
        const password1 = password1Input.value;
        const password2 = password2Input.value;

        if (!password1 || !password2) {
            alert('Por favor, preencha ambas as senhas.');
            return;
        }

        const matchScore = Number(matchScoreInput.value);
        const mismatchScore = Number(mismatchScoreInput.value);
        const gapPenalty = Number(gapPenaltyInput.value);

        if (isNaN(matchScore) || isNaN(mismatchScore) || isNaN(gapPenalty)) {
            alert('Por favor, insira valores numéricos válidos para o Gap, Mismatch ou Match.');
            return;
        }

        const result = sequenceAlignment(password1, password2, matchScore, mismatchScore, gapPenalty);
        const strength = evaluatePasswordStrength(result.score);

        resultDiv.classList.remove('hidden');
        document.getElementById('similarityScore').innerHTML =
            `Similaridade: <span class="font-bold">${result.score.toFixed(2)}%</span>`;

        document.getElementById('strengthAnalysis').innerHTML =
            `<div class="${strength.class}">
                <span class="font-bold">${strength.strength}:</span> ${strength.message}
            </div>`;

        renderMatrix(result.matrix, password1, password2);
    });
}); 