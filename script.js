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

function sequenceAlignment(str1, str2, matchScore, mismatchScore, gapPenalty) {
    const m = str1.length;
    const n = str2.length;
    
    // Inicialização da matriz de memoization
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // Inicialização da primeira linha e coluna com penalidades de gap
    for (let i = 0; i <= m; i++) dp[i][0] = i * gapPenalty;
    for (let j = 0; j <= n; j++) dp[0][j] = j * gapPenalty;
    
    // Preenchimento da matriz usando programação dinâmica
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const match = dp[i-1][j-1] + (str1[i-1] === str2[j-1] ? matchScore : mismatchScore);
            const delete_op = dp[i-1][j] + gapPenalty;
            const insert_op = dp[i][j-1] + gapPenalty;
            
            dp[i][j] = Math.max(match, Math.max(delete_op, insert_op));
        }
    }
    
    // Calcula a pontuação de similaridade normalizada (0 a 100)
    const maxPossibleScore = Math.max(m, n) * matchScore;
    const normalizedScore = ((dp[m][n] + Math.abs(Math.min(0, dp[m][n]))) / maxPossibleScore) * 100;
    
    return {
        score: normalizedScore,
        matrix: dp,
        str1Length: m,
        str2Length: n
    };
}