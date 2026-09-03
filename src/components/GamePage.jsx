import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./GamePage.css";

export default function GamePage(props) {
    const navigate = useNavigate();

    const [grade, setGrade] = useState(0);
    const [gameCounter, setGameCounter] = useState(0);
    const [exerciseQuestion, setExerciseQuestion] = useState("");
    const [wordBank, setWordBank] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [flagAnswered, setFlagAnswered] = useState(false);
    const [answerIsCorrect, setAnswerIsCorrect] = useState(null);

    useEffect(() => {
        props.setWrongQuestions([]);

        if (!props.questions?.length) {
            navigate("/", {replace: true});
            return;
        }

        loadQuestion(0);
    }, []);

    const createWordTokens = (answer) => String(answer ?? "").trim().split(/\s+/).filter(Boolean).map((word, index) => ({id: index, word}));

    const shuffleTokens = (tokens) => {
        const shuffled = [...tokens];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    };

    function loadQuestion(index) {
        const current = props.questions[index];
        const tokens = createWordTokens(current[1]);
        setGameCounter(index);
        setExerciseQuestion(current[0]);
        setWordBank(shuffleTokens(tokens));
        setSelectedWords([]);
        setFlagAnswered(false);
        setAnswerIsCorrect(null);
    }

    const selectWord = (token) => {
        if (flagAnswered) return;
        setSelectedWords((prev) => [...prev, token]);
    };

    const removeWord = (token) => {
        if (flagAnswered) return;
        setSelectedWords((prev) => prev.filter((item) => item.id !== token.id));
    };

    const checkAnswer = () => {
        if (flagAnswered || selectedWords.length !== wordBank.length) return;

        const isCorrect = selectedWords.every((token, index) => token.id === index);
        setFlagAnswered(true);
        setAnswerIsCorrect(isCorrect);

        if (isCorrect) {
            setGrade((prev) => prev + 1);
        } else {
            const current = props.questions[gameCounter];
            props.setWrongQuestions((prev) => [...prev, [current[0], current[1]]]);
        }
    };

    const nextQuestion = () => {
        if (gameCounter + 1 < props.questions.length) {
            loadQuestion(gameCounter + 1);
        } else {
            navigate("/results", {state: {grade, totalQuestions: props.questions.length}});
        }
    };

    const mainAction = () => {
        if (flagAnswered) {
            nextQuestion();
        } else {
            checkAnswer();
        }
    };

    const omitQuestion = () => {
        const current = props.questions[gameCounter];
        props.setWrongQuestions((prev) => [...prev, [current[0], current[1]]]);
        nextQuestion();
    };

    const endGame = () => {
        if (window.confirm("Do you want to end the game?")) navigate("/");
    };

    const selectedIds = new Set(selectedWords.map((token) => token.id));
    const canCheck = selectedWords.length === wordBank.length && wordBank.length > 0;
    const selectedWordClass = flagAnswered ? `answerButton ${answerIsCorrect ? "correct" : "incorrect"}` : "answerButton";

    return (
        <main className="gamePage">
            <section className="gameCard">
                <div className="divisorLabels">
                    <div className="labelPoints">
                        <span>Question: {gameCounter + 1}/{props.questions.length}</span>
                        <span>Points: {grade}/{props.questions.length}</span>
                    </div>
                </div>

                <div className="questionSection">
                    <p className="questionEyebrow">Put the answer in the correct order</p>
                    <h1 className="labelQuestion">{exerciseQuestion}</h1>

                    <div className="answersGrid" aria-label="Your answer">
                        {selectedWords.length === 0 ? (
                            <p></p>
                        ) : (
                            selectedWords.map((token) => (
                                <button type="button" className={selectedWordClass} key={`selected-${token.id}`} onClick={() => removeWord(token)} disabled={flagAnswered}>{token.word}</button>
                            ))
                        )}
                    </div>

                    {flagAnswered && (
                        <p className={answerIsCorrect ? "correct" : "incorrect"}>
                            {answerIsCorrect ? "Correct!" : `Correct answer: ${props.questions[gameCounter][1]}`}
                        </p>
                    )}

                    <div className="answersGrid" aria-label="Word bank">
                        {wordBank.map((token) => !selectedIds.has(token.id) && (
                            <button type="button" className="answerButton" key={`bank-${token.id}`} onClick={() => selectWord(token)} disabled={flagAnswered}>{token.word}</button>
                        ))}
                    </div>
                </div>

                <div className="gameActions">
                    <button onClick={endGame} className="endGameButton">End game</button>
                    <button onClick={mainAction} disabled={!flagAnswered && !canCheck} className={`nextButton ${flagAnswered || canCheck ? "active" : "inactive"}`}>{flagAnswered ? "Next" : "Check"}</button>
                    <button onClick={omitQuestion} disabled={flagAnswered} className="endGameButton">Omit</button>
                </div>
            </section>
        </main>
    );
}
