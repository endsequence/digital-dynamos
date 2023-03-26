const { Configuration, OpenAIApi } = require('openai')
const cache = require('memory-cache');

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY
})

const openai = new OpenAIApi(configuration);


const askGpt = async (ques) => {
    let finalData = '';
    const finalArr = [];
    const resData = await new Promise(async (resolve, reject) => {
        try {
            const response = await openai.createCompletion({
                model: "text-davinci-002",
                prompt: ques,
                max_tokens: 1000,
                temperature: 1,
                stream: true,
            }, { responseType: 'stream' });

            response.data.on('data', data => {
                const lines = data.toString().split('\n').filter(line => line.trim() !== '');
                for (const line of lines) {
                    const message = line.replace(/^data: /, '');
                    if (message === '[DONE]') {
                        resolve(finalData)
                        return; // Stream finished
                    }
                    try {
                        // console.log({ message })
                        const parsed = JSON.parse(message);
                        // console.log(parsed.choices[0].text);
                        finalArr.push(parsed.choices[0].text)
                        finalData = `${finalData}${parsed.choices[0].text}`
                    } catch (error) {
                        console.error('Could not JSON parse stream message', message, error);
                    }
                }
            });
        } catch (error) {
            console.log({ error })
            if (error.response?.status) {
                console.error(error.response.status, error.message);
                error.response.data.on('data', data => {
                    const message = data.toString();
                    try {
                        const parsed = JSON.parse(message);
                        console.error('An error occurred during OpenAI request: ', parsed);
                    } catch (error) {
                        console.error('An error occurred during OpenAI request: ', message);
                    }
                });
            } else {
                console.error('An error occurred during OpenAI request', error);
            }
        }
    });

    return finalData

};

const prepareQuiz = async (ques) => {
    const gptResp = await askGpt(ques);
    const contentArr = gptResp.split('\n').filter(item => item !== "");
    const arrayLength = contentArr.length;
    const question = arrayLength === 7 ? `${contentArr[0]} ${contentArr[1]}` :  contentArr[0];
    const options = [contentArr[arrayLength-5], contentArr[arrayLength-4], contentArr[arrayLength-3], contentArr[arrayLength-2]];

    const anwserFull = contentArr[arrayLength-1];
    const anwser = anwserFull?.includes(')') ? anwserFull?.split(')')[0] :anwserFull?.charAt(0);
    console.log({ gptResp,options, anwser, contentArr, length: contentArr.length });
    return { contentArr, question, anwserFull, anwser, options }
}

const getQuiz = async (req, res) => {
    let quiz = await prepareQuiz(req.body.ques);
    if (!quiz.anwser || quiz.options.find(el => !el.includes(')'))) {
        quiz = await prepareQuiz(req.body.ques);
    }
    let { question, anwserFull, anwser, options } = quiz;
    const quesId = Date.now();

    cache.put(`${quesId}`, anwser);
    res.send({ question, anwserFull, anwser, options, quesId })
}

const verifyAnswer = async (req, res) => {
    const { quesId, answer } = req.body;
    const correctAnswer = await cache.get(`${quesId}`)
    const isCorrect = correctAnswer === answer;
    if (isCorrect) {
        cache.del(`${quesId}`)
    }
    res.send({ isCorrect, correctAnswer })
}
module.exports = { askGpt, getQuiz, verifyAnswer };
