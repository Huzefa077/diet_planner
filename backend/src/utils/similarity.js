const cosineSimilarity = (ratedVectors, allVectors)=>{
    const similarityScores = allVectors.map((vector)=>{
        let sumXY = 0, sumX2 = 0, sumY2 = 0;
        for(let i=0; i<vector.length ; i++){
            for(let ratedVectors of ratedVectors){
                sumXY += ratedVectors[i] * vector[i];
                sumX2 += ratedVectors[i] ** 2;
                sumY2 += vector[i] ** 2;
            }
        } 
        return sumXY / (Math.sqrt(sumX2) * Math.sqrt(sumY2) || 1);
    })
    return similarityScores;
}

export {cosineSimilarity}